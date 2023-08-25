import type { DataServices, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application, Cas2Application, OASysSections } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { DateFormats } from '../../../../utils/dateUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

type GuidanceBody = Record<string, never>

type RiskToSelfTaskData = {
  'risk-to-self': {
    currentRisk: {
      currentRiskDetail: string
    }
    vulnerability: {
      vulnerabilityDetail: string
    }
  }
}

@Page({
  name: 'guidance',
  bodyProperties: [],
})
export default class RiskToSelfGuidance implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Import ${this.personName}'s risk to self data from OASys`

  body: GuidanceBody

  oasysCompleted = ''

  oasysStarted = ''

  hasOasysRecord: boolean

  noOasysBannerText = `No OASys record available to import for ${this.personName}`

  noOasysDescriptiveText = `No information can be imported for the risk to self section because ${this.personName} 
                            does not have a Layer 3 OASys completed in the last 6 months.`

  taskData = ''

  taskName = 'risk-to-self'

  constructor(
    body: Partial<GuidanceBody>,
    private readonly application: Application,
    oasysSections: OASysSections,
    taskData: string,
  ) {
    this.body = body as GuidanceBody
    this.oasysStarted =
      oasysSections?.dateStarted && DateFormats.isoDateToUIDate(oasysSections?.dateStarted, { format: 'medium' })
    this.oasysCompleted =
      oasysSections?.dateCompleted && DateFormats.isoDateToUIDate(oasysSections?.dateCompleted, { format: 'medium' })
    this.hasOasysRecord = (oasysSections && Boolean(Object.keys(oasysSections).length)) || false
    this.taskData = taskData
  }

  static async initialize(
    body: Partial<GuidanceBody>,
    application: Cas2Application,
    token: string,
    dataServices: DataServices,
  ) {
    let oasysSections
    let taskDataJson

    try {
      oasysSections = await dataServices.personService.getOasysSections(token, application.person.crn)

      taskDataJson = JSON.stringify(RiskToSelfGuidance.getTaskData(oasysSections))
    } catch (e) {
      if (e.status === 404) {
        oasysSections = null
      } else {
        throw e
      }
    }
    return new RiskToSelfGuidance(body, application, oasysSections, taskDataJson)
  }

  private static getTaskData(oasysSections: OASysSections): Partial<RiskToSelfTaskData> {
    const taskData = { 'risk-to-self': {} } as Partial<RiskToSelfTaskData>
    oasysSections.riskToSelf.forEach(question => {
      if (question.questionNumber === 'R8.1.1') {
        taskData['risk-to-self'].currentRisk = { currentRiskDetail: question.answer }
      } else if (question.questionNumber === 'R8.3.1') {
        taskData['risk-to-self'].vulnerability = { vulnerabilityDetail: question.answer }
      }
    })
    return taskData
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'vulnerability'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    const response = {}

    return response
  }
}
