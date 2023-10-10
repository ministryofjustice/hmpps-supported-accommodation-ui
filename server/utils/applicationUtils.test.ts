import { applicationFactory } from '../testutils/factories'
import { inProgressApplicationTableRows } from './applicationUtils'
import { fullPersonFactory } from '../testutils/factories/person'

describe('inProgressApplicationTableRows', () => {
  it('returns an array of applications as table rows', async () => {
    const applicationA = applicationFactory.build({
      person: fullPersonFactory.build({ name: 'A' }),
      createdAt: '2022-11-10T21:47:28Z',
    })
    const applicationB = applicationFactory.build({
      person: fullPersonFactory.build({ name: 'B' }),
      createdAt: '2022-11-11T21:47:28Z',
    })

    const result = inProgressApplicationTableRows([applicationA, applicationB])

    expect(result).toEqual([
      [
        {
          html: `<a href=/applications/${applicationA.id} data-cy-id="${applicationA.id}">A</a>`,
        },
        {
          text: applicationA.person.crn,
        },
        {
          text: '10 November 2022',
        },
      ],
      [
        {
          html: `<a href=/applications/${applicationB.id} data-cy-id="${applicationB.id}">B</a>`,
        },
        {
          text: applicationB.person.crn,
        },
        {
          text: '11 November 2022',
        },
      ],
    ])
  })
})
