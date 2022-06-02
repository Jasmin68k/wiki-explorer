// import { DatabaseError } from './customerrors.js'
// import { Page, TitlePage } from './datamodels.js'

const dbName = 'wiki-explorer'
const osNames = [
  'maininfo',
  'categories',
  'redirects',
  'results',
  'resultscategories',
  'resultsredirects'
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
    // reconstruct like this in get function
    // console.log(new Map(JSON.parse(data.pages)))

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
        if (!(key === 'categories')) {
          delete resultPage[key]
        }
      }
    }
    let data = {
      date: new Date(),
      categories: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }
    // reconstruct like this in get function
    // console.log(new Map(JSON.parse(categories.pages)))

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
      redirects: JSON.stringify(Array.from(resultsPagesDeepCopy))
    }
    // reconstruct like this in get function
    // console.log(new Map(JSON.parse(redirects.pages)))

    let objectStore = transaction.objectStore('resultsredirects')
    objectStore.put(data, title)
  })
}

// // no add needed, put is fine (create or overwrite) for what we do
// export function putData(data, key) {
//   return new Promise((resolve, reject) => {
//     let transaction = db.transaction([osName], 'readwrite')
//     transaction.oncomplete = () => {
//       resolve()
//     }
//     transaction.onerror = (event) => {
//       reject(event.target.error)
//     }

//     objectStore = transaction.objectStore(osName)
//     objectStore.put(data, key)
//   })
// }

// export function getData(key) {
//   return new Promise((resolve, reject) => {
//     let transaction = db.transaction([osName])
//     transaction.onerror = (event) => {
//       reject(event.target.error)
//     }

//     let objectStore = transaction.objectStore(osName)
//     let request = objectStore.get(key)

//     // bubbles to transaction
//     // request.onerror = (event) => {
//     //   reject(event.target.error)
//     // }

//     //also fired, if key not found (result undefined), so test needed
//     request.onsuccess = () => {
//       if (request.result === undefined) {
//         let error = { message: 'Key does not exist in database.' }
//         reject(error)
//       } else {
//         resolve(request.result)
//       }
//     }
//   })
// }
