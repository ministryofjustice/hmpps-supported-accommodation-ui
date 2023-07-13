import ApplyPage from './applyPage'

export default class FundingInformationPage extends ApplyPage {
  constructor() {
    super('Emergency application', application, 'basic-information', 'reason-for-short-notice')
  }

  completeForm(): void {
    this.checkRadioButtonFromPageBody('reason')
  }
}
