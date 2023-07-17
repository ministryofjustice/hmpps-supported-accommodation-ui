/* istanbul ignore file */

import { Section, Task } from '../../utils/decorators'
import FundingInformation from './fundingInformation'

@Task({
  slug: 'area-and-funding',
  name: 'Funding information for CAS-2 placement',
  pages: [FundingInformation],
})
@Section({
  title: 'Area and funding',
  tasks: [AreaAndFunding],
})
export default class AreaAndFunding {}
