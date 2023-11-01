/* istanbul ignore file */

import { controllers as applyControllers } from './apply'

import { Services } from '../services'
import PeopleController from './peopleController'
import SubmittedApplicationsController from './assess/submittedApplicationsController'

export const controllers = (services: Services) => {
  const peopleController = new PeopleController(services.applicationService, services.personService)
  const submittedApplicationsController = new SubmittedApplicationsController(services.submittedApplicationService)
  return {
    submittedApplicationsController,
    peopleController,
    ...applyControllers(services),
  }
}

export type Controllers = ReturnType<typeof controllers>
