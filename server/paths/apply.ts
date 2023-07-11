import { path } from 'static-path'

const applicationsPath = path('/applications')
const singleApplicationPath = applicationsPath.path(':id')
const peoplePath = applicationsPath.path('people')

const paths = {
  applications: {
    create: applicationsPath.path('create'),
    new: applicationsPath.path('new'),
    people: {
      find: peoplePath.path('find'),
    },
    show: singleApplicationPath,
  },
}

export default paths
