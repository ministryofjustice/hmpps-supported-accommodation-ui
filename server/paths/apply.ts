import { path } from 'static-path'

const applicationsPath = path('/applications')

const peoplePath = applicationsPath.path('people')
const risksPath = applicationsPath.path(':crn')

const paths = {
  applications: {
    new: applicationsPath.path('new'),
    people: {
      find: peoplePath.path('find'),
    },
    show: risksPath.path('show'),
  },
}

export default paths
