import { applicationFactory, personFactory } from '../testutils/factories'
import { getTaskResponsesAsSummaryListItems } from './checkYourAnswersUtils'

describe('getTaskResponsesAsSummaryListItems', () => {
  const person = personFactory.build()
  const application = applicationFactory.build({
    person,
    data: {
      'confirm-eligibility': {
        'confirm-eligibility': {
          isEligible: 'yes',
        },
      },
    },
  })

  it('returns a summary list row for a given task', () => {
    const expected = [
      {
        key: { text: `Is ${person.name} eligible for Short-Term Accommodation (CAS-2)?` },
        value: { text: `Yes, I confirm ${person.name} is eligible` },
      },
    ]
    expect(getTaskResponsesAsSummaryListItems('confirm-eligibility', application)).toEqual(expected)
  })
})
