/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import Acct from './acct'
import AcctData from './custom-forms/acctData'
import AdditionalInformation from './additionalInformation'
import CurrentRisk from './currentRisk'
import HistoricalRisk from './historicalRisk'
import OasysImport from './custom-forms/oasysImport'
import Vulnerability from './vulnerability'

@Task({
  name: 'Review risk to self information',
  slug: 'risk-to-self',
  pages: [OasysImport, Vulnerability, CurrentRisk, HistoricalRisk, Acct, AcctData, AdditionalInformation],
})
export default class RiskToSelf {}
