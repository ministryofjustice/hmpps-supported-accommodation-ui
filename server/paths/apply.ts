import { path } from 'static-path'

const applicationsPath = path('/applications')
const singleApplicationPath = applicationsPath.path(':id')
const pagesPath = singleApplicationPath.path('tasks/:task/pages/:page')
const peoplePath = applicationsPath.path('people')

const paths = {
  applications: {
    create: applicationsPath.path('create'),
    index: applicationsPath,
    new: applicationsPath.path('new'),
    people: {
      find: peoplePath.path('find'),
    },
    show: singleApplicationPath,
    submission: singleApplicationPath.path('submission'),
    pages: {
      show: pagesPath,
      update: pagesPath,
    },
    update: singleApplicationPath,
    appendToList: singleApplicationPath.path('list'),
  },
}

export default paths
