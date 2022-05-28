export class NetworkError extends Error {
  constructor(message = 'NetworkError') {
    super(message)
    this.name = 'NetworkError'
  }
}
export class DataError extends Error {
  constructor(message = 'DataError') {
    super(message)
    this.name = 'DataError'
  }
}
// export class DatabaseError extends Error {
//   constructor(message = 'DatabaseError') {
//     super(message)
//     this.name = 'DatabaseError'
//   }
// }
