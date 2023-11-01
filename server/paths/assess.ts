import { path } from 'static-path'

const assessApplicationsPath = path('/assess/applications')
const singleApplicationPath = assessApplicationsPath.path(':id')

export default {
  submittedApplications: {
    index: assessApplicationsPath,
    show: singleApplicationPath,
  },
}
