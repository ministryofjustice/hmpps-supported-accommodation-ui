import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { sentenceCase, nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'

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
  title = `Communication and language needs for ${nameOrPlaceholderCopy(this.application.person)}`

  questions = {
    hasCommunicationNeeds: {
      question: 'Do they have any additional communication needs?',
      communicationDetail: {
        question: 'Please describe their communication needs.',
      },
    },
    requiresInterpreter: {
      question: 'Do they need an interpreter?',
      interpretationDetail: {
        question: 'What language do they need an interpreter for?',
      },
    },
    hasSupportNeeds: {
      question: 'Do they need any support to see, hear, speak, or understand?',
      supportDetail: {
        question: 'Please describe their support needs.',
      },
    },
  }

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
      [this.questions.hasCommunicationNeeds.communicationDetail.question]: this.body.communicationDetail,

      [this.questions.requiresInterpreter.question]: sentenceCase(this.body.requiresInterpreter),
      [this.questions.requiresInterpreter.interpretationDetail.question]: this.body.interpretationDetail,

      [this.questions.hasSupportNeeds.question]: sentenceCase(this.body.hasSupportNeeds),
      [this.questions.hasSupportNeeds.supportDetail.question]: this.body.supportDetail,
    }

    return response
  }
}
