import { NetworkError, DataError } from '@/customerrors.js'
import { Page, TitlePage } from '@/datamodels.js'
import i18n from '@/i18n'

let jsonData = {}

// Api-User-Agent can be used instead of regular User-Agent (good practice, not always enforced by wikimedia)
// User-Agent might not be possible to set in every browser
const fetchHeaders = new Headers({
  'Api-User-Agent': 'WikiExplorer/0.1',
  'User-Agent': 'WikiExplorer/0.1'
})

/**
 * Query Wikipedia for all Wikipedia pages linked to from Wikipedia page given by title and language
 * @param {String} title
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Map<Page>} with keys pageId and values Page (imported class) with title, url, pageid and missing populated
 */
export async function wikiFetchPages(title, language) {
  const pages = new Map()

  do {
    try {
      let pageUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
        title +
        '&prop=info&inprop=url&origin=*'

      if (jsonData.continue) {
        for (const continueToken of Object.keys(jsonData.continue)) {
          pageUrl +=
            '&' + continueToken + '=' + jsonData.continue[continueToken]
        }
      }

      const response = await fetch(pageUrl, {
        headers: fetchHeaders
      })

      if (!response.ok) {
        const message = `${response.status} ${response.statusText}`
        throw new NetworkError(message)
      }
      jsonData = await response.json()

      if (!jsonData.query) {
        throw new DataError('No result from API')
      }

      for (const pageId of Object.keys(jsonData.query.pages)) {
        // ignore (sometimes) appearing title page in results
        if (!(jsonData.query.pages[pageId].title === title)) {
          if (jsonData.query.pages[pageId].missing !== '') {
            pages.set(
              pageId,
              new Page({
                title: jsonData.query.pages[pageId].title,
                url: jsonData.query.pages[pageId].fullurl,
                pageid: jsonData.query.pages[pageId].pageid,
                missing: false
              })
            )
          } else {
            pages.set(
              pageId,
              new Page({
                title: jsonData.query.pages[pageId].title,
                url: jsonData.query.pages[pageId].fullurl,
                // in case of missing page jsonData.query.pages[pageId].pageid does not exist,
                // which is otherwise identical to pageId.
                // the values for pageId for all missing pages are consecutive negative integers starting at -1,
                // which naturally do not reference an actual Wikipedia page, but are assigned here to
                // Page's pageid to make it unique, too.
                pageid: Number(pageId)
              })
            )
          }
        }
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(`${error.name}: ${error.message}`)
    }
  } while (jsonData.continue)

  return pages
}

/**
 * Query Wikipedia for Wikipedia page given by title and language
 * @param {String} title
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {TitlePage} (imported class) with extract, title, url, pageid and missing populated
 */
export async function wikiFetchTitlePage(title, language) {
  const titlePage = new TitlePage()

  titlePage.extract = ''
  titlePage.image = ''
  titlePage.missing = true

  try {
    const mainInfoUrl =
      'https://' +
      language +
      '.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info|pageimages&piprop=original&exintro&redirects=1&indexpageids&inprop=url&titles=' +
      title +
      '&origin=*'

    const response = await fetch(mainInfoUrl, {
      headers: fetchHeaders
    })

    // ok = true on http 200-299 good response
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`
      throw new NetworkError(message)
    }
    const jsonTitleData = await response.json()
    const pageId = jsonTitleData.query.pageids[0]
    if (jsonTitleData.query.pages[pageId].extract) {
      titlePage.extract = jsonTitleData.query.pages[pageId].extract
    }
    titlePage.title = jsonTitleData.query.pages[pageId].title
    titlePage.url = jsonTitleData.query.pages[pageId].fullurl
    titlePage.pageid = Number(pageId)

    if (jsonTitleData.query.pages[pageId].missing !== '') {
      titlePage.missing = false
    }

    // check if image exists
    if ((titlePage.image = jsonTitleData.query.pages[pageId].original)) {
      titlePage.image = jsonTitleData.query.pages[pageId].original.source
    } else {
      // otherwise undefined
      titlePage.image = ''
    }
  } catch (error) {
    // add error/display for user or similar
    console.error(error.message)
  }
  return titlePage
}

/**
 * Query Wikipedia for all categories of all Wikipedia pages linked to from Wikipedia page given by title and language
 * and add those to given Map, separate newly added and no longer existing pages
 * @param {String} title
 * @param {String} language two letter lower case ('en, 'de')
 * @param {Map<Page>} pages with keys pageId and values Page (imported class)
 * @returns {Object Map<Page> Map<Page> Set<String} pages with categories populated, added pages, pageids of deleted pages
 */
export async function wikiFetchAddCategoriesToPages(title, language, pages) {
  const pageIds = new Set()
  const categoriesAddedPages = new Map()
  const categoriesDeletedPages = new Set()

  do {
    try {
      // separate categories results fetch for major speedup compared to getting info and categories prop at same time (more redundant props to go through)

      let pageUrlCategories =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
        title +
        '&prop=categories&cllimit=max&clshow=!hidden&origin=*'

      if (jsonData.continue) {
        for (const continueToken of Object.keys(jsonData.continue)) {
          pageUrlCategories +=
            '&' + continueToken + '=' + jsonData.continue[continueToken]
        }
      }

      const response = await fetch(pageUrlCategories, {
        headers: fetchHeaders
      })

      if (!response.ok) {
        const message = `${response.status} ${response.statusText}`
        throw new NetworkError(message)
      }
      jsonData = await response.json()

      if (!jsonData.query) {
        throw new DataError('No result from API')
      }

      for (const pageId of Object.keys(jsonData.query.pages)) {
        const page = jsonData.query.pages[pageId]

        // ignore possibly non existing (ignored before) title page in results
        if (!(page.title === title)) {
          // add all pageIds from categories fetch for later removal of leftovers in original results
          pageIds.add(pageId)
          // fetch page if exists in categories, but not in original results
          // can happen, if changes between page fetch (mabye from cache) and categories fetch
          if (!pages.get(pageId) && !categoriesAddedPages.get(pageId)) {
            const newpage = await wikiFetchSinglePage(pageId, language)

            if (!(newpage.title === title)) {
              if (newpage.missing !== '') {
                categoriesAddedPages.set(
                  pageId,
                  new Page({
                    title: newpage.title,
                    url: newpage.fullurl,
                    pageid: newpage.pageid,
                    missing: false
                  })
                )
              } else {
                categoriesAddedPages.set(
                  pageId,
                  new Page({
                    title: newpage.title,
                    url: newpage.fullurl,
                    pageid: Number(pageId)
                  })
                )
              }
            }
          }

          let resultPage

          if (page.categories) {
            page.categories.forEach((category) => {
              if (pages.get(pageId)) {
                resultPage = pages.get(pageId)
              } else {
                resultPage = categoriesAddedPages.get(pageId)
              }
              resultPage.categories.push(category.title)
            })

            // filter "Category:" at beginning

            for (let i = 0; i < resultPage.categories.length; i++) {
              // not sure it always starts with "Category:", check and only remove if it does
              if (
                resultPage.categories[i].startsWith(
                  i18n.global.t('category-prefix')
                )
              ) {
                resultPage.categories[i] = resultPage.categories[i].substring(
                  i18n.global.t('category-prefix').length
                )
              }
            }
          }
        }
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (jsonData.continue)

  // handle page still exists in resultsPages, but not in categories fetch anymore -> delete
  for (const pageId of pages.keys()) {
    if (!pageIds.has(pageId)) {
      categoriesDeletedPages.add(pageId)
    }
  }

  // add emptycategory to objects without category for filter
  for (const pageId of pages.keys()) {
    const resultPage = pages.get(pageId)
    if (resultPage.categories.length === 0) {
      resultPage.categories = [i18n.global.t('no-category-prefix')]
    }
  }

  for (const pageId of categoriesAddedPages.keys()) {
    const resultPage = categoriesAddedPages.get(pageId)
    if (resultPage.categories.length === 0) {
      resultPage.categories = [i18n.global.t('no-category-prefix')]
    }
  }

  return {
    pages: pages,
    addedPages: categoriesAddedPages,
    deletedPages: categoriesDeletedPages
  }
}

// Since redirects are being fetched in parallel individually for each Page for speed reasons, title is taken from Page in pages
// and does not need to be specified as a parameter.
/**
 * Query Wikipedia for all redirects of all Wikipedia pages given as Page in Map with language
 * and add those to Map
 * @param {String} language two letter lower case ('en, 'de')
 * @param {Map<Page>} pages with keys pageId and values Page (imported class)
 * @returns {Map<Page>} pages with redirects populated
 */
export async function wikiFetchAddRedirectsToPages(language, pages) {
  // results -> {Map<Promise>}
  const results = new Map()

  // initial throttle value in ms
  const throttle = 0
  // number of ms to increase throttle each retry
  const throttleincrease = 20
  // number of retries
  const retries = 100

  // don't fire too many at once -> 429/ratelimited

  // finetuned by hand
  // up to 500 requests at once (with throttle 0) AND 500 requests per 10s seems safe
  // number of requests to fire per batch
  // using throttle 0 and batches makes it much faster for smaller pages
  // retried fetch should ideally only happen, if these safe values fail
  // or maybe if clicked many pages slightly below 500 in rapid succession

  // with possible categories fetch in parallel, there are extra requests,
  // so bit smaller than 500 - 480 seems ok
  const batchsize = 480
  const batchdelay = 10000

  let batchcount = 0
  // parallelized fetching of redirects
  for (const pageId of pages.keys()) {
    const resultPage = pages.get(pageId)

    await new Promise((resolve) => setTimeout(resolve, throttle))
    results.set(
      pageId,
      getSingleRedirect(
        language,
        resultPage,
        throttle,
        throttleincrease,
        retries
      )
    )
    batchcount += 1
    if (batchcount > batchsize) {
      batchcount = 0
      await new Promise((resolve) => setTimeout(resolve, batchdelay))
    }
  }
  // page -> {Promise}
  for (const page of results.values()) {
    await page
  }

  return pages
}

/**
 * Query Wikipedia for all categories of Wikipedia page given by title and language and add those to given TitlePage (imported class)
 * @param {String} title
 * @param {String} language two letter lower case ('en, 'de')
 * @param {TitlePage} page (imported class)
 * @returns {TitlePage} page with categories populated
 */
export async function wikiFetchAddCategoriesToTitlePage(title, language, page) {
  page.categories = []
  let jsonCategories = {}

  do {
    try {
      // separate categories fetch, instead of adding to main info, for simple continue handling
      let categoriesUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
        title +
        '&origin=*'

      if (jsonCategories.continue) {
        for (const continueToken of Object.keys(jsonCategories.continue)) {
          categoriesUrl +=
            '&' + continueToken + '=' + jsonCategories.continue[continueToken]
        }
      }

      const response = await fetch(categoriesUrl, {
        headers: fetchHeaders
      })

      // ok = true on http 200-299 good response
      if (!response.ok) {
        const message = `${response.status} ${response.statusText}`
        throw new NetworkError(message)
      }
      jsonCategories = await response.json()

      const results = Object.values(jsonCategories.query.pages)

      if (!results[0].categories) {
        continue
      }
      // ...query.pages has only one prop at this level equal to page id. -> array index [0]
      for (let i = 0; i < results[0].categories.length; i++) {
        page.categories.push(results[0].categories[i].title)
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (jsonCategories.continue)

  // filter "Category:" at beginning
  for (let i = 0; i < page.categories.length; i++) {
    // not sure it always starts with "Category:", check and only remove if it does
    if (page.categories[i].startsWith(i18n.global.t('category-prefix'))) {
      page.categories[i] = page.categories[i].substring(
        i18n.global.t('category-prefix').length
      )
    }
  }

  //sort - results seem sorted, but just to be sure
  page.categories.sort()

  return page
}

/**
 * Query Wikipedia for all redirects of Wikipedia page given by title and language and add those to given TitlePage (imported class)
 * @param {String} title
 * @param {String} language two letter lower case ('en, 'de')
 * @param {TitlePage} page (imported class)
 * @returns {TitlePage} page with redirects populated
 */
export async function wikiFetchAddRedirectsToTitlePage(title, language, page) {
  page.redirects = []
  let jsonRedirects = {}

  do {
    try {
      let redirectsUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&prop=redirects&format=json&rdlimit=max&titles=' +
        title +
        '&origin=*'
      if (jsonRedirects.continue) {
        for (const continueToken of Object.keys(jsonRedirects.continue)) {
          redirectsUrl +=
            '&' + continueToken + '=' + jsonRedirects.continue[continueToken]
        }
      }

      const response = await fetch(redirectsUrl, {
        headers: fetchHeaders
      })

      // ok = true on http 200-299 good response
      if (!response.ok) {
        const message = `${response.status} ${response.statusText}`
        throw new NetworkError(message)
      }
      jsonRedirects = await response.json()

      const results = Object.values(jsonRedirects.query.pages)

      if (!results[0].redirects) {
        continue
      }
      // ...query.pages has only one prop at this level equal to page id. -> array index [0]
      for (let i = 0; i < results[0].redirects.length; i++) {
        page.redirects.push(results[0].redirects[i].title)
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (jsonRedirects.continue)

  //sort
  page.redirects.sort()

  return page
}

// for parallelized fetching of redirects
/**
 * Query Wikipedia for all redirects of a Wikipedia page given by resultPage.title and language and add those to resultPage
 * @param {String} language two letter lower case ('en, 'de')
 * @param {Page} resultPage (imported class)
 * @param {Number} throttle initial throttle value in ms
 * @param {Number} throttleincrease number of ms to increase throttle each retry
 * @param {Number} retries number of retries with throttle increased each time
 */
async function getSingleRedirect(
  language,
  resultPage,
  throttle,
  throttleincrease,
  retries
) {
  let jsonRedirects = {}

  do {
    try {
      let redirectsUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&prop=redirects&format=json&rdlimit=max&titles=' +
        resultPage.title +
        '&origin=*'
      if (jsonRedirects.continue) {
        for (const continueToken of Object.keys(jsonRedirects.continue)) {
          redirectsUrl +=
            '&' + continueToken + '=' + jsonRedirects.continue[continueToken]
        }
      }

      const response = await fetchRetry(
        redirectsUrl,
        {
          headers: fetchHeaders
        },
        retries,
        throttle,
        throttleincrease
      )

      jsonRedirects = await response.json()

      const results = Object.values(jsonRedirects.query.pages)

      if (!results[0].redirects) {
        continue
      }

      // ...query.pages has only one prop at this level equal to page id. -> array index [0]
      for (let i = 0; i < results[0].redirects.length; i++) {
        resultPage.redirects.push(results[0].redirects[i].title)
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (jsonRedirects.continue)

  //sort
  resultPage.redirects.sort()
}

/**
 * fetch() with configurable number of retries and initial throttle value
 * @param {String} url url to fetch (resource)
 * @param {Object} options options for fetch (init)
 * @param {Number} retries maximum number of retries before failure
 * @param {Number} throttle initial throttle value in ms, increases each failed request
 * @param {Number} throttleincrease number of ms to add to throttle value each retry
 * @returns {Promise<Response>}
 */
async function fetchRetry(url, options, retries, throttle, throttleincrease) {
  // wiki returns cross origin request blocked, code 429, when too fast
  let response = ''
  try {
    response = await fetch(url, options)
    if (response.ok) {
      return response
    }
    // in case fetch does not throw (usually does not for regular 4xx 5xx errors, but wiki cross origin blocked with 429), but !response.ok
    throw new NetworkError()
  } catch (error) {
    if (retries <= 1) {
      //empty on fetch throw
      let message = ''
      if (response) {
        message = `${response.status} ${response.statusText}`
      } else {
        message = 'API Fetch thrown. No status response.'
      }
      throw new NetworkError(message)
    }
    // add 20ms for retry
    const throttlenew = throttle + throttleincrease
    await new Promise((resolve) => setTimeout(resolve, throttlenew))
    return await fetchRetry(url, options, retries - 1, throttlenew)
  }
}

/**
 * Query Wikipedia for page given by title and language and return title of page possibly redirected to
 * (used to resolve title, which might only be a redirect, to title of actual Wikipedia page)
 * @param {String} title
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {String} actual title of page
 */
export async function wikiFetchGetRedirectTarget(title, language) {
  let redirectTarget = ''
  try {
    const redirectTargetUrl =
      'https://' +
      language +
      '.wikipedia.org/w/api.php?action=query&format=json&titles=' +
      title +
      '&redirects&origin=*'

    const response = await fetch(redirectTargetUrl, {
      headers: fetchHeaders
    })
    // ok = true on http 200-299 good response
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`
      throw new NetworkError(message)
    }

    const redirectFull = await response.json()

    const pageId = Object.keys(redirectFull.query.pages)[0]

    if (redirectFull.query.pages[pageId].missing === undefined) {
      redirectTarget = redirectFull.query.pages[pageId].title
    }
  } catch (error) {
    // add error/display for user or similar
    console.error(error.message)
  }

  return redirectTarget
}

/**
 * Query Wikipedia for page given by pageid and language and return it
 * @param {String} pageid
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Page} Page (imported class) with title, url, pageid and missing populated
 */

export async function wikiFetchSinglePage(pageid, language) {
  let page
  try {
    const url =
      'https://' +
      language +
      '.wikipedia.org/w/api.php?format=json&action=query&prop=info&redirects=1&indexpageids&inprop=url&pageids=' +
      pageid +
      '&origin=*'

    const response = await fetch(url, {
      headers: fetchHeaders
    })

    // ok = true on http 200-299 good response
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`
      throw new NetworkError(message)
    }
    // add error handling
    const jsonData = await response.json()

    if (jsonData.query.pages[pageid].missing !== '') {
      page = new Page({
        title: jsonData.query.pages[pageid].title,
        url: jsonData.query.pages[pageid].fullurl,
        pageid: jsonData.query.pages[pageid].pageid,
        missing: false
      })
    } else {
      page = new Page({
        title: jsonData.query.pages[pageid].title,
        url: jsonData.query.pages[pageid].fullurl,
        // in case of missing page jsonData.query.pages[pageId].pageid does not exist,
        // which is otherwise identical to pageId.
        // the values for pageId for all missing pages are consecutive negative integers starting at -1,
        // which naturally do not reference an actual Wikipedia page, but are assigned here to
        // Page's pageid to make it unique, too.
        pageid: Number(pageid)
      })
    }
  } catch (error) {
    // add error/display for user or similar
    console.error(error.message)
  }
  return page
}
