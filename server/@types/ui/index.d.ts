export type UserDetails = {
  id: string
  name: string
  displayName: string
  roles: Array<UserRole>
}

export type OasysImportArrays = ArrayOfOASysRiskOfSeriousHarmSummaryQuestions

// A utility type that allows us to define an object with a date attribute split into
// date, month, year (and optionally, time) attributes. Designed for use with the GOV.UK
// date input
export type ObjectWithDateParts<K extends string | number> = { [P in `${K}-${'year' | 'month' | 'day'}`]: string } & {
  [P in `${K}-time`]?: string
} & {
  [P in K]?: string
}
