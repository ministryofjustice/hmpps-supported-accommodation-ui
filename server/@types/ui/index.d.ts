export type JourneyType = 'applications'

export type UiTask = {
  id: string
  title: string
  pages: Record<string, unknown>
}
export type FormSection = {
  title: string
  name: string
  tasks: Array<UiTask>
}

export type FormSections = Array<FormSection>
export type TaskNames = 'funding-information'
export type FormPages = { [key in TaskNames]: Record<string, unknown> }

export type TaskStatus = 'not_started' | 'in_progress' | 'complete' | 'cannot_start'
export type TaskWithStatus = UiTask & { status: TaskStatus }

export type TaskListErrors<K extends TasklistPage> = Partial<Record<keyof K['body'], unknown>>
interface TasklistPage {
  body: Record<string, unknown>
}

export type PageResponse = Record<string, string | Array<string> | Array<Record<string, unknown>>>

export type FormArtifact = Cas2Application

export type DataServices = Partial<{
  personService: {
    findByCrn: (token: string, crn: string) => Promise<Person>
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

export interface RadioItem {
  text: string
  value: string
  checked?: boolean
  hint?: { text: string }
  conditional?: {
    html?: string
  }
}
