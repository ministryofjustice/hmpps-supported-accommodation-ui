import { Cas2Application as Application } from '../../../server/@types/shared/models/Cas2Application'
import ApplyPage from './applyPage'

export default class FundingInformationPage extends ApplyPage {
  constructor(application: Application) {
    super('Funding information', application, 'area-and-funding', 'funding-information')
  }
}
