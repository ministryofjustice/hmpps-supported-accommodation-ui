import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class AcctDataPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Add an ACCT entry', application, 'risk-to-self', 'acct-data')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-to-self',
        page: 'acct-data',
      }),
    )
  }

  addACCTInformation(): void {
    this.completeDateInputs('createdDate', '2022-07-15')
    this.completeDateInputs('expiryDate', '2023-07-15')
    this.getTextInputByIdAndEnterDetails('referringInstitution', 'HMPPS prison')
    this.getTextInputByIdAndEnterDetails('acctDetails', 'some detail')
  }
}
