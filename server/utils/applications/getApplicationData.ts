import { Cas2Application as Application, UpdateApplication } from '@approved-premises/api'

export const getApplicationUpdateData = (application: Application): UpdateApplication => {
  return {
    type: 'CAS2',
    data: application.data,
  }
}
