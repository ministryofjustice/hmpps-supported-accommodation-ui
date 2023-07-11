/* istanbul ignore file */

import { controllers as applyControllers } from './apply'

import { Services } from '../services'
import PeopleController from './peopleController'

export const controllers = (services: Services) => {
  const peopleController = new PeopleController(services.applicationService, services.personService)
  return {
    peopleController,
    ...applyControllers(services),
  }
}

export type Controllers = ReturnType<typeof controllers>
