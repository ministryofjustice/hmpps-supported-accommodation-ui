/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import RiskToSelfGuidance from './riskToSelfGuidance'
import Vulnerability from './vulnerability'
import CurrentRisk from './currentRisk'
import HistoricalRisk from './historicalRisk'

@Task({
  name: 'Review risk to self information',
  slug: 'risk-to-self',
  pages: [RiskToSelfGuidance, Vulnerability, CurrentRisk, HistoricalRisk],
})
export default class RiskToSelf {}
