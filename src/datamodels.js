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
  redirects
  /** @member {String[]} categories */
  categories
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
    this.title = title
    this.url = url
    this.pageid = pageid
    this.redirects = redirects
    this.categories = categories
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
    this.extract = extract
    this.image = image
  }
}
