/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import RiskToSelfGuidance from './riskToSelfGuidance'
import Vulnerability from './vulnerability'
import CurrentRisk from './currentRisk'

@Task({
  name: 'Review risk to self information',
  slug: 'risk-to-self',
  pages: [RiskToSelfGuidance, Vulnerability, CurrentRisk],
})
export default class RiskToSelf {}
