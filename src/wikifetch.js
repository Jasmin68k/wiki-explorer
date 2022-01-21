import { NetworkError, DataError } from './customerrors.js'
import { Page, TitlePage } from './datamodels.js'

let jsonDataFullQueryPart = {}

// Api-User-Agent can be used instead of regular User-Agent (good practice, not always enforced by wikimedia)
// User-Agent might not be possible to set in every browser
let fetchHeaders = new Headers({
  'Api-User-Agent': 'WikiExplorer/0.1',
  'User-Agent': 'WikiExplorer/0.1'
})

let categoryPrefix = {
  en: 'Category:',
  de: 'Kategorie:'
}

let noCategoryPrefix = {
  en: '[ NO CATEGORY ]',
  de: '[ KEINE KATEGORIE ]'
}

export async function wikiFetchPages(title, language) {
  let pages = new Map()

  do {
    try {
      let pageUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
        title +
        '&prop=info&inprop=url&origin=*'

      if (jsonDataFullQueryPart.continue) {
        for (const continueToken of Object.keys(
          jsonDataFullQueryPart.continue
        )) {
          pageUrl +=
            '&' +
            continueToken +
            '=' +
            jsonDataFullQueryPart.continue[continueToken]
        }
      }

      const response = await fetch(pageUrl, {
        headers: fetchHeaders
      })

      if (!response.ok) {
        const message = `${response.status} ${response.statusText}`
        throw new NetworkError(message)
      }
      jsonDataFullQueryPart = await response.json()

      if (!jsonDataFullQueryPart.query) {
        throw new DataError('No result from API')
      }

      for (const pageId of Object.keys(jsonDataFullQueryPart.query.pages)) {
        // ignore (sometimes) appearing title page in results
        if (!(jsonDataFullQueryPart.query.pages[pageId].title === title)) {
          if (jsonDataFullQueryPart.query.pages[pageId].missing !== '') {
            pages.set(
              pageId,
              new Page({
                title: jsonDataFullQueryPart.query.pages[pageId].title,
                url: jsonDataFullQueryPart.query.pages[pageId].fullurl,
                pageid: jsonDataFullQueryPart.query.pages[pageId].pageid,
                missing: false
              })
            )
          } else {
            pages.set(
              pageId,
              new Page({
                title: jsonDataFullQueryPart.query.pages[pageId].title,
                url: jsonDataFullQueryPart.query.pages[pageId].fullurl,
                // in case of missing page jsonDataFullQueryPart.query.pages[pageId].pageid does not exist,
                // which is otherwise identical to pageId.
                // the values for pageId for all missing pages are consecutive negative integers starting at -1,
                // which naturally do not reference an actual Wikipedia page, but are assigned here to
                // Page's pageid to make it unique, too.
                pageid: pageId
              })
            )
          }
        }
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(`${error.name}: ${error.message}`)
    }
  } while (jsonDataFullQueryPart.continue)

  return pages
}

export async function wikiFetchTitlePage(title, language) {
  let titlePage = new TitlePage()

  titlePage.extract = ''
  titlePage.image = ''
  titlePage.missing = true

  try {
    let mainInfoUrl =
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
    // add error handling
    const responseFull = await response.json()
    const pageId = responseFull.query.pageids[0]
    if (responseFull.query.pages[pageId].extract) {
      titlePage.extract = responseFull.query.pages[pageId].extract
    }
    titlePage.title = responseFull.query.pages[pageId].title
    titlePage.url = responseFull.query.pages[pageId].fullurl
    titlePage.pageid = pageId

    if (responseFull.query.pages[pageId].missing !== '') {
      titlePage.missing = false
    }

    // check if image exists
    if ((titlePage.image = responseFull.query.pages[pageId].original)) {
      titlePage.image = responseFull.query.pages[pageId].original.source
    }
  } catch (error) {
    // add error/display for user or similar
    console.error(error.message)
  }
  return titlePage
}

export async function wikiFetchAddCategoriesToPages(title, language, pages) {
  do {
    try {
      // separate categories results fetch for major speedup compared to getting info and categories prop at same time (more redundant props to go through)

      let pageUrlCategories =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
        title +
        '&prop=categories&cllimit=max&clshow=!hidden&origin=*'

      if (jsonDataFullQueryPart.continue) {
        for (const continueToken of Object.keys(
          jsonDataFullQueryPart.continue
        )) {
          pageUrlCategories +=
            '&' +
            continueToken +
            '=' +
            jsonDataFullQueryPart.continue[continueToken]
        }
      }

      const response = await fetch(pageUrlCategories, {
        headers: fetchHeaders
      })

      if (!response.ok) {
        const message = `${response.status} ${response.statusText}`
        throw new NetworkError(message)
      }
      jsonDataFullQueryPart = await response.json()

      if (!jsonDataFullQueryPart.query) {
        throw new DataError('No result from API')
      }

      for (const pageId of Object.keys(jsonDataFullQueryPart.query.pages)) {
        const page = jsonDataFullQueryPart.query.pages[pageId]

        // ignore possibly non existing (ignored before) title page in results
        if (!(page.title === title)) {
          const resultPage = pages.get(pageId)
          if (page.categories) {
            page.categories.forEach((category) =>
              resultPage.categories.push(category.title)
            )

            // filter "Category:" at beginning
            for (let i = 0; i < resultPage.categories.length; i++) {
              // not sure it always starts with "Category:", check and only remove if it does
              if (
                resultPage.categories[i].startsWith(categoryPrefix[language])
              ) {
                resultPage.categories[i] = resultPage.categories[i].substring(
                  categoryPrefix[language].length
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
  } while (jsonDataFullQueryPart.continue)

  // add emptycategory to objects without category for filter
  for (const pageId of pages.keys()) {
    const resultPage = pages.get(pageId)
    if (resultPage.categories.length === 0) {
      resultPage.categories = [noCategoryPrefix[language]]
    }
  }

  return pages
}

export async function wikiFetchAddRedirectsToPages(title, language, pages) {
  let resultsPromises = new Map()

  // initial throttle value in ms
  const throttle = 20
  // number of retries with throttle doubled each time
  const retries = 10

  // parallelized fetching of redirects
  for (const pageId of pages.keys()) {
    const resultPage = pages.get(pageId)
    // don't fire too many at once -> 429/ratelimited
    await new Promise((resolve) => setTimeout(resolve, throttle))
    resultsPromises.set(
      pageId,
      getSingleRedirect(title, language, resultPage, throttle, retries)
    )
  }
  for (const pagePromise of resultsPromises.values()) {
    await pagePromise
  }

  return pages
}

export async function wikiFetchAddCategoriesToTitlePage(title, language, page) {
  page.categories = []
  let categoriesQueryPart = {}

  do {
    try {
      // separate categories fetch, instead of adding to main info, for simple continue handling
      let categoriesUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
        title +
        '&origin=*'

      if (categoriesQueryPart.continue) {
        for (const continueToken of Object.keys(categoriesQueryPart.continue)) {
          categoriesUrl +=
            '&' +
            continueToken +
            '=' +
            categoriesQueryPart.continue[continueToken]
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
      categoriesQueryPart = await response.json()

      let resultsArray = Object.values(categoriesQueryPart.query.pages)

      if (!resultsArray[0].categories) {
        continue
      }
      // ...query.pages has only one prop at this level equal to page id. -> array index [0]
      for (let i = 0; i < resultsArray[0].categories.length; i++) {
        page.categories.push(resultsArray[0].categories[i].title)
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (categoriesQueryPart.continue)

  // filter "Category:" at beginning
  for (let i = 0; i < page.categories.length; i++) {
    // not sure it always starts with "Category:", check and only remove if it does
    if (page.categories[i].startsWith(categoryPrefix[language])) {
      page.categories[i] = page.categories[i].substring(
        categoryPrefix[language].length
      )
    }
  }

  //sort - results seem sorted, but just to be sure
  page.categories.sort()

  return page
}

export async function wikiFetchAddRedirectsToTitlePage(title, language, page) {
  page.redirects = []
  let redirectsQueryPart = {}

  do {
    try {
      let redirectsUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&prop=redirects&format=json&rdlimit=max&titles=' +
        title +
        '&origin=*'
      if (redirectsQueryPart.continue) {
        for (const continueToken of Object.keys(redirectsQueryPart.continue)) {
          redirectsUrl +=
            '&' +
            continueToken +
            '=' +
            redirectsQueryPart.continue[continueToken]
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
      redirectsQueryPart = await response.json()

      let resultsArray = Object.values(redirectsQueryPart.query.pages)

      if (!resultsArray[0].redirects) {
        continue
      }
      // ...query.pages has only one prop at this level equal to page id. -> array index [0]
      for (let i = 0; i < resultsArray[0].redirects.length; i++) {
        page.redirects.push(resultsArray[0].redirects[i].title)
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (redirectsQueryPart.continue)

  //sort
  page.redirects.sort()

  return page
}

// for parallelized fetching of redirects
async function getSingleRedirect(
  title,
  language,
  resultPage,
  throttle,
  retries
) {
  let redirectsQueryPart = {}

  do {
    try {
      let redirectsUrl =
        'https://' +
        language +
        '.wikipedia.org/w/api.php?action=query&prop=redirects&format=json&rdlimit=max&titles=' +
        resultPage.title +
        '&origin=*'
      if (redirectsQueryPart.continue) {
        for (const continueToken of Object.keys(redirectsQueryPart.continue)) {
          redirectsUrl +=
            '&' +
            continueToken +
            '=' +
            redirectsQueryPart.continue[continueToken]
        }
      }

      const response = await fetchRetry(
        redirectsUrl,
        {
          headers: fetchHeaders
        },
        retries,
        throttle
      )

      redirectsQueryPart = await response.json()

      let resultsArray = Object.values(redirectsQueryPart.query.pages)

      if (!resultsArray[0].redirects) {
        continue
      }

      // ...query.pages has only one prop at this level equal to page id. -> array index [0]
      for (let i = 0; i < resultsArray[0].redirects.length; i++) {
        resultPage.redirects.push(resultsArray[0].redirects[i].title)
      }
    } catch (error) {
      // add error/display for user or similar
      console.error(error.message)
    }
  } while (redirectsQueryPart.continue)

  //sort
  resultPage.redirects.sort()
}

async function fetchRetry(url, options, retries, throttle) {
  // wiki returns cross origin request blocked, code 429, when too fast
  let response = ''
  try {
    response = await fetch(url, options)
    if (response.ok) {
      return response
    }
    // in case fetch does not throw (usually does not for regular 4xx 5xx errors, but wiki cross origin blocked with 429), but !response.ok
    // console.log('FETCH FAILED WITHOUT THROW')
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
    await new Promise((resolve) => setTimeout(resolve, throttle * 2))
    return await this.fetchRetry(url, options, retries - 1, throttle * 2)
  }
}

export async function wikiFetchGetRedirectTarget(title, language) {
  let redirectTarget = ''
  try {
    let redirectTargetUrl =
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

    if (redirectFull.query.pages) {
      const pageId = Object.keys(redirectFull.query.pages)[0]
      redirectTarget = redirectFull.query.pages[pageId].title
    }
  } catch (error) {
    // add error/display for user or similar
    console.error(error.message)
  }

  return redirectTarget
}
