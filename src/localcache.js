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

export function openDatabase() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(dbName, 1)

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

export function clearDatabase() {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < osNames.length; i++) {
      let transaction = db.transaction([osNames[i]], 'readwrite')
      transaction.oncomplete = () => {
        resolve()
      }
      transaction.onerror = (event) => {
        reject(event.target.error)
      }

      let objectStore = transaction.objectStore(osNames[i])
      objectStore.clear()
    }
  })
}

export function getCacheMainInfo(title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['maininfo'])
    let objectStore = transaction.objectStore('maininfo')
    let request = objectStore.get(title)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

export function getCacheCategories(title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['categories'])
    let objectStore = transaction.objectStore('categories')
    let request = objectStore.get(title)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

export function getCacheRedirects(title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['redirects'])
    let objectStore = transaction.objectStore('redirects')
    let request = objectStore.get(title)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

export function getCacheRedirectTarget(search) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['redirecttargets'])
    let objectStore = transaction.objectStore('redirecttargets')
    let request = objectStore.get(search)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

export function getCacheResults(title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['results'])
    let objectStore = transaction.objectStore('results')
    let request = objectStore.get(title)

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

export function getCacheResultsCategories(title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['resultscategories'])
    let objectStore = transaction.objectStore('resultscategories')
    let request = objectStore.get(title)

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

export function getCacheResultsRedirects(title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['resultsredirects'])
    let objectStore = transaction.objectStore('resultsredirects')
    let request = objectStore.get(title)

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
export function putCacheMainInfo(titlePage) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['maininfo'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    let data = {
      date: new Date(),
      extract: titlePage.extract,
      image: titlePage.image,
      title: titlePage.title,
      url: titlePage.url,
      pageid: titlePage.pageid,
      missing: titlePage.missing
    }

    let objectStore = transaction.objectStore('maininfo')
    objectStore.put(data, titlePage.title)
  })
}

export function putCacheCategories(titlePage) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['categories'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    let data = {
      date: new Date(),
      categories: [...titlePage.categories]
    }

    let objectStore = transaction.objectStore('categories')
    objectStore.put(data, titlePage.title)
  })
}

export function putCacheRedirects(titlePage) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['redirects'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    let data = {
      date: new Date(),
      redirects: [...titlePage.redirects]
    }

    let objectStore = transaction.objectStore('redirects')
    objectStore.put(data, titlePage.title)
  })
}

export function putCacheResults(resultsPages, title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['results'], 'readwrite')
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

    let data = {
      date: new Date(),
      pages: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }

    let objectStore = transaction.objectStore('results')
    objectStore.put(data, title)
  })
}

export function putCacheResultsCategories(resultsPages, title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['resultscategories'], 'readwrite')
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
    let data = {
      date: new Date(),
      pages: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }

    let objectStore = transaction.objectStore('resultscategories')
    objectStore.put(data, title)
  })
}

export function putCacheResultsRedirects(resultsPages, title) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['resultsredirects'], 'readwrite')
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
    let data = {
      date: new Date(),
      pages: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }

    let objectStore = transaction.objectStore('resultsredirects')
    objectStore.put(data, title)
  })
}

export function putCacheRedirectTarget(search, target) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(['redirecttargets'], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    let data = {
      date: new Date(),
      redirecttarget: target
    }

    let objectStore = transaction.objectStore('redirecttargets')
    objectStore.put(data, search)
  })
}
