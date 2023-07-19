/* istanbul ignore file */

import { dataAccess } from '../data'

import UserService from './userService'
import PersonService from './personService'
import ApplicationService from './applicationService'
import TaskListService from './taskListService'

export const services = () => {
  const { hmppsAuthClient, personClient, applicationClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const personService = new PersonService(personClient)
  const applicationService = new ApplicationService(applicationClient)

  return {
    userService,
    personService,
    applicationService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PersonService, ApplicationService, TaskListService }
