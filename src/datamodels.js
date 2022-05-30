/**
 * Result page
 */
export class Page {
  /** @member {String} title */
  title
  /** @member {String} url */
  url
  /** @member {Number} pageid */
  pageid
  /** @member {String[]} redirects */
  redirects = []
  /** @member {String[]} categories */
  categories = []
  /** @member {Boolean} missing */
  missing

  /**
   * result page
   * @param {Object} resultPage
   * @param {String} title - page title
   * @param {String} url - URL to Wikipedia entry
   * @param {Number} pageid - pageId
   * @param {String[]} redirects - redirects to page
   * @param {String[]} categories - page's categories
   * @param {Boolean} missing - page is missing on Wikipedia (resultPage) or no search result (titlePage)
   */

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#unpacking_fields_from_objects_passed_as_a_function_parameter
  constructor({
    title = '',
    url = '',
    pageid = 0,
    redirects = [],
    categories = [],
    missing = true
  } = {}) {
    // use ducktyping to detect strings
    if (!title.substring) {
      throw new TypeError('Expected title to be a string.')
    }
    this.title = title

    // Maybe add check for valid url later
    if (!url.substring) {
      throw new TypeError('Expected url to be a string.')
    }
    this.url = url

    if (isNaN(pageid)) {
      throw new TypeError('Expected pageid to be a number.')
    }
    this.pageid = pageid

    if (
      !Array.isArray(redirects) ||
      !redirects.every((redirect) => !!redirect.substring)
    ) {
      throw new TypeError('Expected redirects to be an array of strings.')
    }
    // only set the values of the given array, not the array itself as it's an external reference
    this.redirects.push(...redirects)

    if (
      !Array.isArray(categories) ||
      !categories.every((category) => !!category.substring)
    ) {
      throw new TypeError('Expected categories to be an array of strings.')
    }
    this.categories.push(...categories)

    if (!(!!missing === missing)) {
      throw new TypeError('Expected missing to be a boolean.')
    }
    this.missing = missing
  }
}

/**
 * Title page
 */
export class TitlePage extends Page {
  /** @member {String} extract */
  extract
  /** @member {String} image */
  image
  /**
   * title page
   * @param {Object} titlePage
   * @param {String} title - page title
   * @param {String} url - URL to Wikipedia entry
   * @param {Number} pageid - pageId
   * @param {String[]} redirects - redirects to page
   * @param {String[]} categories - page's categories
   * @param {Boolean} missing - page is missing on Wikipedia (resultPage) or no search result (titlePage)
   * @param {String} extract - page extract (contains HTML, can be directly rendered)
   * @param {String} image - URL to page image
   */

  constructor({
    title = '',
    url = '',
    pageid = 0,
    redirects = [],
    categories = [],
    missing = true,
    extract = '',
    image = ''
  } = {}) {
    super({
      title: title,
      url: url,
      pageid: pageid,
      redirects: redirects,
      categories: categories,
      missing: missing
    })
    if (!extract.substring) {
      throw new TypeError('Expected extract to be a string.')
    }
    this.extract = extract

    // Maybe add check for valid url later
    if (!image.substring) {
      throw new TypeError('Expected image to be a string.')
    }
    this.image = image
  }
}

// Are booleans for categories and redirects in cache needed or is some kind of invalid or unset Date sufficient?
// If needed, add later. Maybe use very old Date, much larger than any possible max cache age as invalid.
/**
 * Cache page
 */
export class CachePage {
  /** @member {TitlePage} titlePage */
  titlePage
  /** @member {Map<Page>} resultsPages */
  resultsPages
  /** @member {Date} titleDate */
  titleDate
  /** @member {Date} categoriesDate */
  categoriesDate
  /** @member {Date} redirectsDate */
  redirectsDate

  /**
   * cache page - bundles one TitlePage plus results in Map<Page> and dates for cache age (title, categories, redirects)
   * @param {Object} CachePage
   * @param {TitlePage} titlePage - TitlePage
   * @param {Map<Page>} resultsPages - Map of results with type Page
   * @param {Date} titleDate - titlePage cache age
   * @param {Date} categoriesDate - categories cache age
   * @param {Date} redirectsDate - redirects cache age
   */

  constructor({
    titlePage = new TitlePage(),
    resultsPages = new Map(),
    titleDate = new Date(),
    categoriesDate = new Date(),
    redirectsDate = new Date()
  } = {}) {
    if (!(titlePage instanceof TitlePage)) {
      throw new TypeError(
        'Expected titlePage to be an instance of class TitlePage.'
      )
    }
    this.titlePage = titlePage

    // add type checking for keys of Map instance of Page?
    if (!(resultsPages instanceof Map)) {
      throw new TypeError('Expected resultsPages to be a Map.')
    }
    this.resultsPages = resultsPages

    if (!(titleDate instanceof Date)) {
      throw new TypeError('Expected titleDate to be a Date.')
    }
    this.titleDate = titleDate

    if (!(categoriesDate instanceof Date)) {
      throw new TypeError('Expected categoriesDate to be a Date.')
    }
    this.categoriesDate = categoriesDate

    if (!(redirectsDate instanceof Date)) {
      throw new TypeError('Expected redirectsDate to be a Date.')
    }
    this.redirectsDate = redirectsDate
  }
}
