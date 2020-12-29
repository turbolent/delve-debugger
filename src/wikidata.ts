export class Wikidata {
  private static readonly QUERY_BASE = "http://query.wikidata.org/"

  static getQueryURL(query: string): string {
    return [Wikidata.QUERY_BASE, encodeURIComponent(query)].join("#")
  }
}
