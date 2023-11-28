/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import OffendingHistory from './offending-history'
import HDCLicenceAndCPPDetails from './hdc-licence-and-cpp-details'

@Section({
  title: 'Offence and licence information',
  tasks: [OffendingHistory, HDCLicenceAndCPPDetails],
})
export default class OffenceAndLicenceInformation {}
