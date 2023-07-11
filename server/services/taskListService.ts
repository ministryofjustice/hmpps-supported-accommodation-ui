import { Cas2Application as Application } from '@approved-premises/api'

export default class TaskListService {
  application: Application

  constructor(application: Application) {
    this.application = application
  }
}
