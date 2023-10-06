import { OASysRiskOfSeriousHarm } from '../shared/models/OASysRiskOfSeriousHarm'
import { OASysRiskToSelf } from '../shared/models/OASysRiskToSelf'
import { OASysSections } from '../shared/models/OASysSections'
import { RoshRisksEnvelope } from '../shared/models/RoshRisksEnvelope'

export type JourneyType = 'applications'

export type UiTask = {
  id: string
  title: string
  pages: Record<string, unknown>
}

// export type FormSection = {
//   title: string
//   name: string
//   tasks: Array<UiTask>
// }

export type FormSections = Array<FormSection>

export type TaskNames = 'funding-information' | 'confirm-eligibility' | 'equality-and-diversity-monitoring'

export type FormPages = { [key in TaskNames]: Record<string, unknown> }

export type TaskStatus = 'not_started' | 'in_progress' | 'complete' | 'cannot_start'
export type TaskWithStatus = UiTask & { status: TaskStatus }

export type TaskListErrors<K extends TasklistPage> = Partial<Record<keyof K['body'], unknown>>
interface TasklistPage {
  body: Record<string, unknown>
}

export type YesOrNo = 'yes' | 'no'

export type YesOrNoOrPreferNotToSay = 'yes' | 'no' | 'preferNotToSay'

export type YesNoOrIDK = YesOrNo | 'iDontKnow'

export type YesOrNoWithDetail<T extends string> = {
  [K in T]: YesOrNo
} & {
  [K in `${T}Detail`]: string
}

export type PageResponse = Record<string, string | Array<string> | Array<Record<string, unknown>>>

export type FormArtifact = Cas2Application

export type DataServices = Partial<{
  personService: {
    findByCrn: (token: string, crn: string) => Promise<Person>
    getOasysSections: (token: string, crn: string) => Promise<OASysSections>
    getOasysRiskToSelf: (token: string, crn: string) => Promise<OASysRiskToSelf>
    getOasysRosh: (token: string, crn: string) => Promise<OASysRiskOfSeriousHarm>
    getRoshRisks: (token: string, crn: string) => Promise<RoshRisksEnvelope>
  }
  applicationService: {
    findApplication: (token: string, id: string) => Promise<Cas2Application>
  }
  userService: {
    getUserById: (token: string, id: string) => Promise<User>
  }
}>

export interface ErrorsAndUserInput {
  errorTitle?: string
  errors: ErrorMessages
  errorSummary: Array<string>
  userInput: Record<string, unknown>
}

export interface ErrorMessage {
  text: string
  attributes: {
    [K: string]: boolean
  }
}
export interface ErrorMessages {
  [K: string]: ErrorMessage
}

export interface ErrorSummary {
  text?: string
  html?: string
  href?: string
}

export type UserDetails = {
  id: string
  name: string
  displayName: string
  roles: Array<UserRole>
}

export type OasysImportArrays = ArrayOfOASysRiskOfSeriousHarmSummaryQuestions

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High'

export type TierNumber = '1' | '2' | '3' | '4'
export type TierLetter = 'A' | 'B' | 'C' | 'D'
export type RiskTierLevel = `${TierLetter}${TierNumber}`

// A utility type that allows us to define an object with a date attribute split into
// date, month, year (and optionally, time) attributes. Designed for use with the GOV.UK
// date input
export type ObjectWithDateParts<K extends string | number> = { [P in `${K}-${'year' | 'month' | 'day'}`]: string } & {
  [P in `${K}-time`]?: string
} & {
  [P in K]?: string
}

export type TableRow = Array<TableCell>

export type Radio = {
  attributes?: { [K: string]: string }
  text: string
  value: string
  checked?: boolean
  hint?: { text: string }
  conditional?: {
    html?: string
  }
}

export type RadioItem = Radio | Divider

export type Divider = { divider: string }

export interface GroupedApplications {
  inProgress: Array<ApplicationSummary>
}
export type CheckboxItem =
  | {
      text: string
      value: string
      checked?: boolean
    }
  | Divider

export interface SummaryListItem {
  key: TextItem | HtmlItem
  value: TextItem | HtmlItem
  actions?: { items: Array<SummaryListActionItem> }
}

export interface SummaryList {
  classes?: string
  attributes?: HtmlAttributes
  rows: Array<SummaryListItem>
}

export type SummaryListWithCard = SummaryList & {
  card: {
    title: { text: string }
    actions?: SummaryListActions
    attributes?: HtmlAttributes
  }
}

export type Task = {
  id: string
  title: string
  actionText: string
  pages: Record<string, unknown>
}

export type FormSection = {
  title: string
  name: string
  tasks: Array<Task>
}

export interface TextItem {
  text: string
}

export interface HtmlItem {
  html: string
}
