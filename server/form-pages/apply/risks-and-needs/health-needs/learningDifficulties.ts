import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy, sentenceCase } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type LearningDifficultiesBody = {
  hasLearningNeeds: YesOrNo
  needsDetail: string
  isVulnerable: YesOrNo
  vulnerabilityDetail: string
  hasDifficultyInteracting: YesOrNo
  interactionDetail: string
  requiresAdditionalSupport: YesOrNo
  addSupportDetail: string
}

@Page({
  name: 'learning-difficulties',
  bodyProperties: [
    'hasLearningNeeds',
    'needsDetail',
    'isVulnerable',
    'vulnerabilityDetail',
    'hasDifficultyInteracting',
    'interactionDetail',
    'requiresAdditionalSupport',
    'addSupportDetail',
  ],
})
export default class LearningDifficulties implements TaskListPage {
  documentTitle = 'Learning difficulties and neurodiversity for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Learning difficulties and neurodiversity for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['learning-difficulties']

  body: LearningDifficultiesBody

  constructor(
    body: Partial<LearningDifficultiesBody>,
    private readonly application: Application,
  ) {
    this.body = body as LearningDifficultiesBody
  }

  previous() {
    return 'communication-and-language'
  }

  next() {
    return 'brain-injury'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasLearningNeeds) {
      errors.hasLearningNeeds = `Confirm whether they have additional needs`
    }
    if (this.body.hasLearningNeeds === 'yes' && !this.body.needsDetail) {
      errors.needsDetail = 'Describe the additional support required'
    }

    if (!this.body.isVulnerable) {
      errors.isVulnerable = `Confirm whether they are vulnerable`
    }
    if (this.body.isVulnerable === 'yes' && !this.body.vulnerabilityDetail) {
      errors.vulnerabilityDetail = 'Describe their level of vulnerability'
    }

    if (!this.body.hasDifficultyInteracting) {
      errors.hasDifficultyInteracting = `Confirm whether they have difficulties interacting`
    }
    if (this.body.hasDifficultyInteracting === 'yes' && !this.body.interactionDetail) {
      errors.interactionDetail = 'Describe their difficulties interacting with other people'
    }

    if (!this.body.requiresAdditionalSupport) {
      errors.requiresAdditionalSupport = `Confirm whether additional support is required`
    }
    if (this.body.requiresAdditionalSupport === 'yes' && !this.body.addSupportDetail) {
      errors.addSupportDetail = 'Describe the type of support required'
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.hasLearningNeeds.question]: sentenceCase(this.body.hasLearningNeeds),
      [this.questions.needsDetail.question]: this.body.needsDetail,

      [this.questions.isVulnerable.question]: sentenceCase(this.body.isVulnerable),
      [this.questions.vulnerabilityDetail.question]: this.body.vulnerabilityDetail,

      [this.questions.hasDifficultyInteracting.question]: sentenceCase(this.body.hasDifficultyInteracting),
      [this.questions.interactionDetail.question]: this.body.interactionDetail,

      [this.questions.requiresAdditionalSupport.question]: sentenceCase(this.body.requiresAdditionalSupport),
      [this.questions.addSupportDetail.question]: this.body.addSupportDetail,
    }

    return response
  }
}
