// import { DatabaseError } from './customerrors.js'
// import { Page, TitlePage } from './datamodels.js'

const dbName = 'wiki-explorer'
const osName = 'localcache'
let db
let objectStore

// export function openDatabase() {
//   try {
//     let request = indexedDB.open(dbName, 1)

//     request.onerror = (event) => {
//       throw new DatabaseError(event.target.error)
//     }

//     request.onupgradeneeded = (event) => {
//       db = event.target.result

//       if (!db.objectStoreNames.contains(osName)) {
//         db.createObjectStore(osName)
//       }
//     }

//     request.onsuccess = (event) => {
//       db = event.target.result

//       // error bubbles, generic handler
//       db.onerror = (event) => {
//         throw new DatabaseError(event.target.error)
//       }
//     }
//   } catch (error) {
//     // add error/display for user or similar
//     console.error(error.message)
//   }
// }

export function openDatabase() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(dbName, 1)

    request.onerror = (event) => {
      reject(event.target.error)
    }

    request.onupgradeneeded = (event) => {
      db = event.target.result

      if (!db.objectStoreNames.contains(osName)) {
        db.createObjectStore(osName)
      }
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve()
    }
  })
}

// no add needed, put is fine (create or overwrite) for what we do
export function putData(data, key) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([osName], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    objectStore = transaction.objectStore(osName)
    objectStore.put(data, key)
  })
}

export function getData(key) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([osName])
    transaction.onerror = (event) => {
      reject(event.target.error)
    }

    let objectStore = transaction.objectStore(osName)
    let request = objectStore.get(key)

    // bubbles to transaction
    // request.onerror = (event) => {
    //   reject(event.target.error)
    // }

    //also fired, if key not found (result undefined), so test needed
    request.onsuccess = () => {
      if (request.result === undefined) {
        let error = { message: 'Key does not exist in database.' }
        reject(error)
      } else {
        resolve(request.result)
      }
    }
  })
}
