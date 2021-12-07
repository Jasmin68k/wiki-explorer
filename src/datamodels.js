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
   * @param {String[]} redirects - redirects to page (only one member for TitlePage)
   * @param {String[]} categories - page's categories
   * @param {Boolean} missing - page is missing on Wikipedia
   */

  constructor({
    title = '',
    url = '',
    pageid = 0,
    redirects = [],
    categories = [],
    missing = true
  }) {
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
   * @param {Object} resultPage
   * @param {String} title - page title
   * @param {String} url - URL to Wikipedia entry
   * @param {Number} pageid - pageId
   * @param {String[]} redirects - redirects to page (only one member for TitlePage)
   * @param {String[]} categories - page's categories
   * @param {Boolean} missing - page is missing on Wikipedia
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
  }) {
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
