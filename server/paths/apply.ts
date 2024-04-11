import { path } from 'static-path'

const applicationsPath = path('/applications')
const singleApplicationPath = applicationsPath.path(':id')
const pagesPath = singleApplicationPath.path('tasks/:task/pages/:page')
const peoplePath = applicationsPath.path('people')

const appendToListPath = pagesPath.path('/appendToList')

const removeFromListPath = pagesPath.path(':index/removeFromList')

const prisonDashboardPath = applicationsPath.path('/prison')

const paths = {
  applications: {
    create: applicationsPath.path('create'),
    index: applicationsPath,
    prison: prisonDashboardPath,
    new: applicationsPath.path('new'),
    beforeYouStart: applicationsPath.path('before-you-start'),
    people: {
      find: peoplePath.path('find'),
    },
    show: singleApplicationPath,
    overview: singleApplicationPath.path('overview'),
    submission: singleApplicationPath.path('submission'),
    pages: {
      show: pagesPath,
      update: pagesPath,
    },
    update: singleApplicationPath,
    appendToList: appendToListPath,
    removeFromList: removeFromListPath,
    ineligible: singleApplicationPath.path('not-eligible'),
    consentRefused: singleApplicationPath.path('no-consent-given'),
    addNote: singleApplicationPath.path('add-note'),
  },
}

export default paths
