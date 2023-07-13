import ApplyPage from './applyPage'

export default class FundingInformationePage extends ApplyPage {
  constructor() {
    super('Emergency application', application, 'basic-information', 'reason-for-short-notice')
  }

  completeForm(): void {
    this.checkRadioButtonFromPageBody('reason')
  }
}
