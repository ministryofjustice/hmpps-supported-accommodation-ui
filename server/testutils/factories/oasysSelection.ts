import { Factory } from 'fishery'
import { faker } from '@faker-js/faker/locale/en_GB'

import type { OASysSection } from '@approved-premises/api'

class OasysSelectionFactory extends Factory<OASysSection> {
  needsLinkedToHarm() {
    return this.params({ linkedToHarm: true, linkedToReOffending: true })
  }

  needsLinkedToReoffending() {
    return this.params({ linkedToHarm: false, linkedToReOffending: true })
  }

  needsNotLinkedToReoffending() {
    return this.params({ linkedToHarm: false, linkedToReOffending: false })
  }
}

export default OasysSelectionFactory.define(() => ({
  section: faker.number.int({ min: 1, max: 20 }),
  name: faker.helpers.arrayElement([
    'accommodation',
    'relationships',
    'emotional',
    'thinking',
    'ete',
    'lifestyle',
    'health',
    'attitudes',
  ]),
  linkedToHarm: faker.datatype.boolean(),
  linkedToReOffending: faker.datatype.boolean(),
}))
