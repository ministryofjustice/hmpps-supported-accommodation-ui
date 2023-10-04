import * as nunjucks from 'nunjucks'

export const escape = (text: string): string => {
  const escapeFilter = new nunjucks.Environment().getFilter('escape')
  return escapeFilter(text).val
}

export const formatLines = (text: string): string => {
  if (!text) {
    return ''
  }

  const normalizedText = normalizeText(text)

  const paragraphs = normalizedText.split('\n\n').map(paragraph =>
    paragraph
      .split('\n')
      .map(line => escape(line))
      .join('<br />'),
  )

  if (paragraphs.length === 1) {
    return paragraphs[0]
  }
  return `<p>${paragraphs.join('</p><p>')}</p>`
}

function normalizeText(text: string): string {
  let output = text.trim()

  output = output.replace(/(\r\n)/g, '\n')
  output = output.replace(/(\r)/g, '\n')
  output = output.replace(/(\n){2,}/g, '\n\n')

  return output
}
