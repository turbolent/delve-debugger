export function encodeQuestion(question: string): string {
  return "#" + encodeURIComponent(question.trim())
}

export function getSavedQuestion(): string {
  const hash = window.location.hash
  if (!hash.length) {
    return ""
  }

  return decodeURIComponent(hash.substring(1))
}

export function saveQuestion(question: string): void {
  const url = encodeQuestion(question)
  const currentURL = encodeQuestion(getSavedQuestion())
  if (url === currentURL) {
    return
  }
  history.pushState({ question }, document.title, url)
}
