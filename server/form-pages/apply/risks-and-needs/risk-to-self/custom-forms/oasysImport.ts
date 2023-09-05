import type { DataServices, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application, Cas2Application, OASysRiskToSelf } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { DateFormats } from '../../../../../utils/dateUtils'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'
import Vulnerability from '../vulnerability'

type GuidanceBody = Record<string, never>

export type RiskToSelfTaskData = {
  'risk-to-self': {
    'current-risk': {
      currentRiskDetail: string
      dateOfOasysImport: Date
    }
    vulnerability: {
      vulnerabilityDetail: string
      dateOfOasysImport: Date
    }
    'historical-risk': {
      historicalRiskDetail: string
      dateOfOasysImport: Date
    }
  }
}

@Page({
  name: 'oasys-import',
  bodyProperties: [],
})
export default class OasysImport implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Import ${this.personName}'s risk to self data from OASys`

  body: GuidanceBody

  oasysCompleted: string

  oasysStarted: string

  hasOasysRecord: boolean

  noOasysBannerText = `No OASys record available to import for ${this.personName}`

  noOasysDescriptiveText = `No information can be imported for the risk to self section because ${this.personName} 
                            does not have a Layer 3 OASys completed in the last 6 months.`

  taskData: string

  taskName = 'risk-to-self'

  constructor(
    body: Partial<GuidanceBody>,
    private readonly application: Application,
    oasys: OASysRiskToSelf,
    taskData: string,
  ) {
    this.body = body as GuidanceBody
    this.hasOasysRecord = (oasys && Boolean(Object.keys(oasys).length)) || false
    if (oasys) {
      this.oasysStarted = oasys.dateStarted && DateFormats.isoDateToUIDate(oasys.dateStarted, { format: 'medium' })
      this.oasysCompleted =
        oasys.dateCompleted && DateFormats.isoDateToUIDate(oasys.dateCompleted, { format: 'medium' })
    }
    this.taskData = taskData
  }

  static async initialize(
    body: Partial<GuidanceBody>,
    application: Cas2Application,
    token: string,
    dataServices: DataServices,
  ) {
    let oasys
    let taskDataJson

    if (!application.data['risk-to-self']) {
      try {
        oasys = await dataServices.personService.getOasysRiskToSelf(token, application.person.crn)

        taskDataJson = JSON.stringify(OasysImport.getTaskData(oasys))
      } catch (e) {
        if (e.status === 404) {
          oasys = null
        } else {
          throw e
        }
      }
      return new OasysImport(body, application, oasys, taskDataJson)
    }
    return new Vulnerability(application.data['risk-to-self'].vulnerability ?? {}, application)
  }

  private static getTaskData(oasysSections: OASysRiskToSelf): Partial<RiskToSelfTaskData> {
    const taskData = { 'risk-to-self': {} } as Partial<RiskToSelfTaskData>
    const today = new Date()

    oasysSections.riskToSelf.forEach(question => {
      switch (question.questionNumber) {
        case 'R8.1.1':
          taskData['risk-to-self']['current-risk'] = { currentRiskDetail: question.answer, dateOfOasysImport: today }
          break
        case 'R8.3.1':
          taskData['risk-to-self'].vulnerability = { vulnerabilityDetail: question.answer, dateOfOasysImport: today }
          break
        case 'R8.1.4':
          taskData['risk-to-self']['historical-risk'] = {
            historicalRiskDetail: question.answer,
            dateOfOasysImport: today,
          }
          break
        default:
          break
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
