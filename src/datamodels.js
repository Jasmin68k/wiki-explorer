// title: String
// url: String - URL to Wikipedia entry
// pageid: Number
// redirects: Array - only one member for TitlePage
// categories: Array
// missing: Boolean
// extract: String - contains HTML, can be directly rendered
// image: String - URL to image

export class Page {
  constructor(title, url, pageid, redirects, categories, missing) {
    this.title = title
    this.url = url
    this.pageid = pageid
    this.redirects = redirects
    this.categories = categories
    this.missing = missing
  }
}

export class TitlePage extends Page {
  constructor(
    title,
    url,
    pageid,
    redirects,
    categories,
    missing,
    extract,
    image
  ) {
    super(title, url, pageid, redirects, categories, missing)
    this.extract = extract
    this.image = image
  }
}
