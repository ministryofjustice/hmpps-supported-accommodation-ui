import { path } from 'static-path'

const peoplePath = path('/people')
const personPath = peoplePath.path(':crn')
const oasysPath = personPath.path('oasys')

export default {
  people: {
    oasys: {
      sections: oasysPath.path('sections'),
    },
  },
}
