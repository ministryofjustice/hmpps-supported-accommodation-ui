/* istanbul ignore file */

import { controllers as applyControllers } from './apply'

import type { Services } from '../services'
import PeopleController from './peopleController'

export const controllers = (services: Services) => {
  const peopleController = new PeopleController()
  return {
    peopleController,
    ...applyControllers(services),
  }
}

export type Controllers = ReturnType<typeof controllers>
