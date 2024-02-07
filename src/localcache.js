const dbName = 'wiki-explorer'
const osNames = [
  'maininfo',
  'categories',
  'redirects',
  'results',
  'resultscategories',
  'resultsredirects',
  'redirecttargets'
]
let db

/**
 * Initialize local cache
 * @returns {Promise} resolve empty or reject with error
 */

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)

    request.onerror = (event) => {
      reject(event.target.error)
    }

    request.onupgradeneeded = (event) => {
      db = event.target.result

      for (let i = 0; i < osNames.length; i++) {
        if (!db.objectStoreNames.contains(osNames[i])) {
          db.createObjectStore(osNames[i])
        }
      }
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve()
    }
  })
}

/**
 * Flush local cache
 * @returns {Promise} resolve empty or reject with error
 */
export function clearDatabase() {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < osNames.length; i++) {
      const transaction = db.transaction([osNames[i]], 'readwrite')
      transaction.oncomplete = () => {
        resolve()
      }
      transaction.onerror = (event) => {
        reject(event.target.error)
      }

      const objectStore = transaction.objectStore(osNames[i])
      objectStore.clear()
    }
  })
}

/**
 * Get MainInfo from cache
 * @param {String} title title to get from cache
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */

export function getCacheMainInfo(title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['maininfo'])
    const objectStore = transaction.objectStore('maininfo')
    const request = objectStore.get(language + '.' + title)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

/**
 * Get MainInfo categories from cache
 * @param {String} title title to get from cache
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */
export function getCacheCategories(title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['categories'])
    const objectStore = transaction.objectStore('categories')
    const request = objectStore.get(language + '.' + title)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

/**
 * Get MainInfo redirects from cache
 * @param {String} title title to get from cache
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */
export function getCacheRedirects(title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['redirects'])
    const objectStore = transaction.objectStore('redirects')
    const request = objectStore.get(language + '.' + title)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

/**
 * Get redirect target from cache
 * @param {String} search original search term before redirect
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */
export function getCacheRedirectTarget(search, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['redirecttargets'])
    const objectStore = transaction.objectStore('redirecttargets')
    const request = objectStore.get(language + '.' + search)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

/**
 * Get results pages from cache
 * @param {String} title title to get from cache
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */
export function getCacheResults(title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['results'])
    const objectStore = transaction.objectStore('results')
    const request = objectStore.get(language + '.' + title)

    request.onsuccess = () => {
      if (request.result) {
        resolve({
          date: request.result.date,
          pages: new Map(JSON.parse(request.result.pages))
        })
      } else {
        resolve(undefined)
      }
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

/**
 * Get results pages categories from cache
 * @param {String} title title to get from cache
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */

export function getCacheResultsCategories(title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['resultscategories'])
    const objectStore = transaction.objectStore('resultscategories')
    const request = objectStore.get(language + '.' + title)

    request.onsuccess = () => {
      if (request.result) {
        resolve({
          date: request.result.date,
          pages: new Map(JSON.parse(request.result.pages))
        })
      } else {
        resolve(undefined)
      }
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

/**
 * Get results pages redirects from cache
 * @param {String} title title to get from cache
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve with result or reject with error
 */

export function getCacheResultsRedirects(title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['resultsredirects'])
    const objectStore = transaction.objectStore('resultsredirects')
    const request = objectStore.get(language + '.' + title)

    request.onsuccess = () => {
      if (request.result) {
        resolve({
          date: request.result.date,
          pages: new Map(JSON.parse(request.result.pages))
        })
      } else {
        resolve(undefined)
      }
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

// no add needed, put is fine (create or overwrite) for what we do

/**
 * Put MainInfo into cache
 * @param {TitlePage} titlePage MainInfo in TitlePage (custom class)
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */

export function putCacheMainInfo(titlePage, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['maininfo'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    const data = {
      date: new Date(),
      extract: titlePage.extract,
      image: titlePage.image,
      title: titlePage.title,
      url: titlePage.url,
      pageid: titlePage.pageid,
      missing: titlePage.missing
    }

    const objectStore = transaction.objectStore('maininfo')
    objectStore.put(data, language + '.' + titlePage.title)
  })
}

/**
 * Put MainInfo categories into cache
 * @param {TitlePage} titlePage MainInfo categories in TitlePage (custom class)
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */

export function putCacheCategories(titlePage, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['categories'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    const data = {
      date: new Date(),
      categories: [...titlePage.categories]
    }

    const objectStore = transaction.objectStore('categories')
    objectStore.put(data, language + '.' + titlePage.title)
  })
}

/**
 * Put MainInfo redirects into cache
 * @param {TitlePage} titlePage MainInfo redirects in TitlePage (custom class)
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */

export function putCacheRedirects(titlePage, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['redirects'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    const data = {
      date: new Date(),
      redirects: [...titlePage.redirects]
    }

    const objectStore = transaction.objectStore('redirects')
    objectStore.put(data, language + '.' + titlePage.title)
  })
}

/**
 * Put results pages into cache
 * @param {Map<Page>} resultsPages Map with each result in Page (custom class)
 * @param {String} title title from search
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */

export function putCacheResults(resultsPages, title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['results'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    // clone and remove categories/redirects
    const resultsPagesDeepCopy = new Map(
      JSON.parse(JSON.stringify(Array.from(resultsPages)))
    )

    for (const pageId of resultsPagesDeepCopy.keys()) {
      const resultPage = resultsPagesDeepCopy.get(pageId)

      delete resultPage['categories']
      delete resultPage['redirects']
    }

    const data = {
      date: new Date(),
      pages: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }

    const objectStore = transaction.objectStore('results')
    objectStore.put(data, language + '.' + title)
  })
}

/**
 * Put results pages categories into cache
 * @param {Map<Page>} resultsPages Map with each result with categories in Page (custom class)
 * @param {String} title title from search
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */

export function putCacheResultsCategories(resultsPages, title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['resultscategories'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    // clone and remove categories/redirects
    const resultsPagesDeepCopy = new Map(
      JSON.parse(JSON.stringify(Array.from(resultsPages)))
    )

    // remove all keys except categories
    for (const pageId of resultsPagesDeepCopy.keys()) {
      const resultPage = resultsPagesDeepCopy.get(pageId)
      for (const key of Object.keys(resultPage)) {
        // leave title for later single fetching in discrepancy check
        if (!(key === 'categories' || key === 'title')) {
          delete resultPage[key]
        }
      }
    }
    const data = {
      date: new Date(),
      pages: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }

    const objectStore = transaction.objectStore('resultscategories')
    objectStore.put(data, language + '.' + title)
  })
}

/**
 * Put results pages redirects into cache
 * @param {Map<Page>} resultsPages Map with each result with redirects in Page (custom class)
 * @param {String} title title from search
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */

export function putCacheResultsRedirects(resultsPages, title, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['resultsredirects'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    // clone and remove categories/redirects
    const resultsPagesDeepCopy = new Map(
      JSON.parse(JSON.stringify(Array.from(resultsPages)))
    )

    // remove all keys except categories
    for (const pageId of resultsPagesDeepCopy.keys()) {
      const resultPage = resultsPagesDeepCopy.get(pageId)
      for (const key of Object.keys(resultPage)) {
        if (!(key === 'redirects')) {
          delete resultPage[key]
        }
      }
    }
    const data = {
      date: new Date(),
      pages: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }

    const objectStore = transaction.objectStore('resultsredirects')
    objectStore.put(data, language + '.' + title)
  })
}

/**
 * Put MainInfo into cache
 * @param {String} search original search term before redirect
 * @param {String} target redirect target
 * @param {String} language two letter lower case ('en, 'de')
 * @returns {Promise} resolve empty or reject with error
 */
export function putCacheRedirectTarget(search, target, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['redirecttargets'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    const data = {
      date: new Date(),
      redirecttarget: target
    }

    const objectStore = transaction.objectStore('redirecttargets')
    objectStore.put(data, language + '.' + search)
  })
}
