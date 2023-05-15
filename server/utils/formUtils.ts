import * as nunjucks from 'nunjucks'

// eslint-disable-next-line import/prefer-default-export
export const escape = (text: string): string => {
  const escapeFilter = new nunjucks.Environment().getFilter('escape')
  return escapeFilter(text).val
}
