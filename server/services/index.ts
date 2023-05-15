/* istanbul ignore file */

import { dataAccess } from '../data'

import UserService from './userService'
import PersonService from './personService'

export const services = () => {
  const { hmppsAuthClient, personClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const personService = new PersonService(personClient)

  return {
    userService,
    personService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PersonService }
