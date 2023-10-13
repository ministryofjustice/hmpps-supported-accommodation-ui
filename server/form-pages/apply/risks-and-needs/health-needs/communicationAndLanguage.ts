import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { sentenceCase, nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type CommunicationAndLanguageBody = {
  hasCommunicationNeeds: YesOrNo
  communicationDetail: string
  requiresInterpreter: YesOrNo
  interpretationDetail: string
  hasSupportNeeds: YesOrNo
  supportDetail: string
}

@Page({
  name: 'communication-and-language',
  bodyProperties: [
    'hasCommunicationNeeds',
    'communicationDetail',
    'requiresInterpreter',
    'interpretationDetail',
    'hasSupportNeeds',
    'supportDetail',
  ],
})
export default class CommunicationAndLanguage implements TaskListPage {
  documentTitle = 'Communication and language needs for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Communication and language needs for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['communication-and-language']

  body: CommunicationAndLanguageBody

  constructor(
    body: Partial<CommunicationAndLanguageBody>,
    private readonly application: Application,
  ) {
    this.body = body as CommunicationAndLanguageBody
  }

  previous() {
    return 'mental-health'
  }

  next() {
    return 'learning-difficulties'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasCommunicationNeeds) {
      errors.hasCommunicationNeeds = `Confirm whether they have additional communication needs`
    }
    if (this.body.hasCommunicationNeeds === 'yes' && !this.body.communicationDetail) {
      errors.communicationDetail = 'Describe their communication needs'
    }

    if (!this.body.requiresInterpreter) {
      errors.requiresInterpreter = `Confirm whether they need an interpreter`
    }
    if (this.body.requiresInterpreter === 'yes' && !this.body.interpretationDetail) {
      errors.interpretationDetail = 'Specify the language the interpreter is needed for'
    }

    if (!this.body.hasSupportNeeds) {
      errors.hasSupportNeeds = `Confirm they they need support`
    }
    if (this.body.hasSupportNeeds === 'yes' && !this.body.supportDetail) {
      errors.supportDetail = 'Describe the support needed to see, hear, speak or understand'
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.hasCommunicationNeeds.question]: sentenceCase(this.body.hasCommunicationNeeds),
      [this.questions.communicationDetail.question]: this.body.communicationDetail,

      [this.questions.requiresInterpreter.question]: sentenceCase(this.body.requiresInterpreter),
      [this.questions.interpretationDetail.question]: this.body.interpretationDetail,

      [this.questions.hasSupportNeeds.question]: sentenceCase(this.body.hasSupportNeeds),
      [this.questions.supportDetail.question]: this.body.supportDetail,
    }

    return response
  }
}
