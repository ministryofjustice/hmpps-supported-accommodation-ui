/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import RiskToSelfGuidance from './riskToSelfGuidance'
import Vulnerability from './vulnerability'
import CurrentRisks from './currentRisks'

@Task({
  name: 'Review risk to self information',
  slug: 'risk-to-self',
  pages: [RiskToSelfGuidance, Vulnerability, CurrentRisks],
})
export default class RiskToSelf {}
