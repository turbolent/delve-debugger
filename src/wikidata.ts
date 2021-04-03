export class Wikidata {
  private static readonly QUERY_BASE = "http://query.wikidata.org/"

  static getQueryURL(query: string): string {
    return [Wikidata.QUERY_BASE, encodeURIComponent(query)].join("#")
  }

  static getItemURL(id: number): string {
    return `https://www.wikidata.org/wiki/Q${id}`
  }

  static getPropertyURL(id: number): string {
    return `https://www.wikidata.org/wiki/Property:P${id}`
  }
}
