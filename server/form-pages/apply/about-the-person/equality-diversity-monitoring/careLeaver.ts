import type { TaskListErrors, YesNoOrDontKnow } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

export const options = {
  yes: 'Yes',
  no: 'No',
  dontKnow: `I don't know`,
}

export type CareLeaverBody = {
  isCareLeaver: YesNoOrDontKnow
}

@Page({
  name: 'care-leaver',
  bodyProperties: ['isCareLeaver'],
})
export default class CareLeaver implements TaskListPage {
  documentTitle = 'Is the person a care leaver?'

  title = `Equality and diversity questions for ${nameOrPlaceholderCopy(this.application.person)}`

  questions = {
    isCareLeaver: `Is ${nameOrPlaceholderCopy(this.application.person)} a care leaver?`,
  }

  body: CareLeaverBody

  constructor(
    body: Partial<CareLeaverBody>,
    private readonly application: Application,
  ) {}

  previous() {
    return 'military-veteran'
  }

  next() {
    return 'parental-carer-responsibilities'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.isCareLeaver) {
      errors.isCareLeaver = errorLookups.isCareLeaver.empty
    }
    return errors
  }

  response() {
    return {
      [this.questions.isCareLeaver]: options[this.body.isCareLeaver],
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(options, this.body.isCareLeaver)

    const dontKnow = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...dontKnow }]
  }
}
