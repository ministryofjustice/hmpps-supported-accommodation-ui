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

export type MilitaryVeteranBody = {
  isVeteran: YesNoOrDontKnow
}

@Page({
  name: 'military-veteran',
  bodyProperties: ['isVeteran'],
})
export default class MilitaryVeteran implements TaskListPage {
  documentTitle = 'Is the person a military veteran?'

  title = `Equality and diversity questions for ${nameOrPlaceholderCopy(this.application.person)}`

  questions = {
    isVeteran: `Is ${nameOrPlaceholderCopy(this.application.person)} a military veteran?`,
  }

  body: MilitaryVeteranBody

  constructor(
    body: Partial<MilitaryVeteranBody>,
    private readonly application: Application,
  ) {}

  previous() {
    return 'religion'
  }

  next() {
    return 'care-leaver'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.isVeteran) {
      errors.isVeteran = errorLookups.isVeteran.empty
    }
    return errors
  }

  response() {
    return {
      [this.questions.isVeteran]: options[this.body.isVeteran],
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(options, this.body.isVeteran)

    const dontKnow = items.pop()
    items.push({ divider: 'or' })

    return [...items, { ...dontKnow }]
  }
}
