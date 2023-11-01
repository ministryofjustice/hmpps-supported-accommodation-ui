import { path } from 'static-path'

const peoplePath = path('/cas2/people')
const personPath = peoplePath.path(':crn')
const oasysPath = personPath.path('oasys')
const applicationsPath = path('/cas2/applications')
const singleApplicationPath = applicationsPath.path(':id')
const submissionsPath = path('/cas2/submissions')
const singleSubmissionPath = submissionsPath.path(':id')

export default {
  people: {
    oasys: {
      sections: oasysPath.path('sections'),
      riskToSelf: oasysPath.path('risk-to-self'),
      rosh: oasysPath.path('rosh'),
    },
    search: peoplePath.path('search'),
    risks: {
      show: personPath.path('risks'),
    },
  },
  submissions: {
    create: submissionsPath,
    show: singleSubmissionPath,
  },
  applications: {
    new: applicationsPath,
    index: applicationsPath,
    show: singleApplicationPath,
    update: singleApplicationPath,
  },
}
