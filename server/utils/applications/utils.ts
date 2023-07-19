import type { FormPages, JourneyType } from '@approved-premises/ui'
import Apply from '../../form-pages/apply'

export const journeyPages = (_journeyType: JourneyType): FormPages => {
  return Apply.pages
}
