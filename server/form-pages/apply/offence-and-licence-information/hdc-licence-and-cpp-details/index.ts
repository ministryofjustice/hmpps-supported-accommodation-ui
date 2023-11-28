/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import HDCLicenceDates from './hdcLicenceDates'

@Task({
  name: 'Add HDC licence and CPP details',
  slug: 'hdc-licence-and-cpp-details',
  pages: [HDCLicenceDates],
})
export default class HDCLicenceAndCPPDetails {}
