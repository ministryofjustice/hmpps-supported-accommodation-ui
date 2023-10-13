import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { nameOrPlaceholderCopy, sentenceCase } from '../../../../utils/utils'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type PhysicalHealthBody = {
  hasPhyHealthNeeds: YesOrNo
  needsDetail: string
  canClimbStairs: YesOrNo
  isReceivingTreatment: YesOrNo
  treatmentDetail: string
  hasPhyHealthMedication: YesOrNo
  medicationDetail: string
  canLiveIndependently: YesOrNo
  indyLivingDetail: string
  requiresAdditionalSupport: YesOrNo
  addSupportDetail: string
}

@Page({
  name: 'physical-health',
  bodyProperties: [
    'hasPhyHealthNeeds',
    'needsDetail',
    'canClimbStairs',
    'isReceivingTreatment',
    'treatmentDetail',
    'hasPhyHealthMedication',
    'medicationDetail',
    'canLiveIndependently',
    'indyLivingDetail',
    'requiresAdditionalSupport',
    'addSupportDetail',
  ],
})
export default class PhysicalHealth implements TaskListPage {
  documentTitle = 'Physical health needs for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Physical health needs for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['physical-health']

  body: PhysicalHealthBody

  constructor(
    body: Partial<PhysicalHealthBody>,
    private readonly application: Application,
  ) {
    this.body = body as PhysicalHealthBody
  }

  previous() {
    return 'substance-misuse'
  }

  next() {
    return 'mental-health'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasPhyHealthNeeds) {
      errors.hasPhyHealthNeeds = 'Confirm whether they have physical health needs'
    }

    if (this.body.hasPhyHealthNeeds === 'yes') {
      if (!this.body.needsDetail) {
        errors.needsDetail = 'Describe physical health needs'
      }

      if (!this.body.canClimbStairs) {
        errors.canClimbStairs = 'Confirm whether they can climb stairs'
      }
    }

    if (!this.body.isReceivingTreatment) {
      errors.isReceivingTreatment = 'Confirm whether they currently receiving treatment'
    }

    if (this.body.isReceivingTreatment === 'yes' && !this.body.treatmentDetail) {
      errors.treatmentDetail = 'Describe their treatment'
    }

    if (this.body.hasPhyHealthMedication === 'yes' && !this.body.medicationDetail) {
      errors.medicationDetail = 'Describe their medication'
    }

    if (!this.body.hasPhyHealthMedication) {
      errors.hasPhyHealthMedication = 'Confirm whether they are currently receiving medication'
    }

    if (!this.body.canLiveIndependently) {
      errors.canLiveIndependently = 'Confirm whether they can live independently'
    }

    if (this.body.canLiveIndependently === 'no' && !this.body.indyLivingDetail) {
      errors.indyLivingDetail = 'Describe why they are unable to live independently'
    }

    if (!this.body.requiresAdditionalSupport) {
      errors.requiresAdditionalSupport = 'Confirm whether they require additional support'
    }

    if (this.body.requiresAdditionalSupport === 'yes' && !this.body.addSupportDetail) {
      errors.addSupportDetail = 'Describe the support required'
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.hasPhyHealthNeeds.question]: sentenceCase(this.body.hasPhyHealthNeeds),
      [this.questions.needsDetail.question]: this.body.needsDetail,
      [this.questions.canClimbStairs.question]: sentenceCase(this.body.canClimbStairs),

      [this.questions.isReceivingTreatment.question]: sentenceCase(this.body.isReceivingTreatment),
      [this.questions.treatmentDetail.question]: this.body.treatmentDetail,

      [this.questions.hasPhyHealthMedication.question]: sentenceCase(this.body.hasPhyHealthMedication),
      [this.questions.medicationDetail.question]: this.body.medicationDetail,

      [this.questions.canLiveIndependently.question]: sentenceCase(this.body.canLiveIndependently),
      [this.questions.indyLivingDetail.question]: this.body.indyLivingDetail,

      [this.questions.requiresAdditionalSupport.question]: sentenceCase(this.body.requiresAdditionalSupport),
      [this.questions.addSupportDetail.question]: this.body.addSupportDetail,
    }

    return response
  }
}
