/* istanbul ignore file */

import ApplicationsController from './applicationsController'

import type { Services } from '../../services'

export const controllers = (services: Services) => {
  const { personService } = services
  const applicationsController = new ApplicationsController(personService)

  return {
    applicationsController,
  }
}

export { ApplicationsController }
