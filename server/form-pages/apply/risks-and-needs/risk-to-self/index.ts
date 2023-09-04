/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import Acct from './acct'
import AcctData from './acctData'
import AdditionalInformation from './additionalInformation'
import CurrentRisk from './currentRisk'
import HistoricalRisk from './historicalRisk'
import RiskToSelfGuidance from './riskToSelfGuidance'
import Vulnerability from './vulnerability'

@Task({
  name: 'Review risk to self information',
  slug: 'risk-to-self',
  pages: [RiskToSelfGuidance, Vulnerability, CurrentRisk, HistoricalRisk, Acct, AcctData, AdditionalInformation],
})
export default class RiskToSelf {}
