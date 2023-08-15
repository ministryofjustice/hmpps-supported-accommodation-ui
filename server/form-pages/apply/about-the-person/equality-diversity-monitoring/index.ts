/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import WillAnswer from './willAnswer'
import Disability from './disability'
import SexAndGender from './sexAndGender'
import SexualOrientation from './sexualOrientation'
import EthnicGroup from './ethnicGroup'
import WhiteBackground from './whiteBackground'
import MixedBackground from './mixedBackground'
import AsianBackground from './asianBackground'
import BlackBackground from './blackBackground'
import OtherBackground from './otherBackground'
import Religion from './religion'
import MilitaryVeteran from './militaryVeteran'
import CareLeaver from './careLeaver'
import CarerResponsibilities from './parentalCarerResponsibilities'

@Task({
  name: 'Complete equality and diversity monitoring',
  slug: 'equality-and-diversity-monitoring',
  pages: [
    WillAnswer,
    Disability,
    SexAndGender,
    SexualOrientation,
    EthnicGroup,
    WhiteBackground,
    MixedBackground,
    AsianBackground,
    BlackBackground,
    OtherBackground,
    Religion,
    MilitaryVeteran,
    CareLeaver,
    CarerResponsibilities,
  ],
})
export default class EqualityAndDiversityMonitoring {}
