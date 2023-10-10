import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import Summary, { SummaryBody } from './summary'

describe('Summary', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new Summary({}, application)

      expect(page.title).toEqual(`Risk of serious harm (RoSH) summary for Roger Smith`)
    })
  })

  describe('import date', () => {
    it('sets importDate to null where application contains no OASys import date', () => {
      const page = new Summary({}, application)

      expect(page.importDate).toEqual(null)
    })
  })

  describe('risks', () => {
    describe('if there are no risk values', () => {
      it('sets the last updated date to null', () => {
        const body: SummaryBody = {
          status: 'retrieved' as const,
          oasysImportDate: '2023-09-15',
        }

        const page = new Summary(body, application)
        expect(page.risks.lastUpdated).toBe(null)
      })
    })

    describe('if risk values exists', () => {
      it('sets the last updated date', () => {
        const body: SummaryBody = {
          status: 'retrieved' as const,
          oasysImportDate: '2023-09-15',
          value: {
            overallRisk: 'a risk',
            riskToChildren: 'another risk',
            riskToPublic: 'a third risk',
            riskToKnownAdult: 'a fourth risk',
            riskToStaff: 'a fifth risk',
            lastUpdated: '2023-09-17',
          },
        }

        const page = new Summary(body, application)
        expect(page.risks).toEqual({ ...body, lastUpdated: '17 September 2023' })
      })
    })
  })

  itShouldHaveNextValue(new Summary({}, application), 'risk-to-others')
  itShouldHavePreviousValue(new Summary({}, application), 'taskList')

  describe('response', () => {
    const body = {
      status: 'retrieved' as const,
      oasysImportDate: '2023-09-15',
      value: {
        overallRisk: 'a risk',
        riskToChildren: 'another risk',
        riskToPublic: 'a third risk',
        riskToKnownAdult: 'a fourth risk',
        riskToStaff: 'a fifth risk',
        lastUpdated: '2023-09-17',
      },
    } as SummaryBody

    const expectedResponse = {
      'Over all risk rating': body.value.overallRisk,
      'Risk to children': body.value.riskToChildren,
      'Risk to known adult': body.value.riskToKnownAdult,
      'Risk to public': body.value.riskToPublic,
      'Risk to staff': body.value.riskToStaff,
    }
    it('returns page body if no additional comments have been added', () => {
      const page = new Summary(body, application)

      expect(page.response()).toEqual(expectedResponse)
    })

    it('returns page body and additional comments if a comment is added', () => {
      const additionalBody = {
        ...body,
        additionalComments: 'some comment',
      }
      const page = new Summary(additionalBody, application)

      expect(page.response()).toEqual({ ...expectedResponse, 'Additional comments (optional)': 'some comment' })
    })

    it('handles unknown risk ratings', () => {
      const bodyWithoutRiskRatings = {
        status: 'retrieved',
        oasysImportDate: '2023-09-15',
        value: null,
      } as SummaryBody

      const page = new Summary(bodyWithoutRiskRatings, application)

      expect(page.response()).toEqual({
        'Over all risk rating': 'Unknown',
        'Risk to children': 'Unknown',
        'Risk to known adult': 'Unknown',
        'Risk to public': 'Unknown',
        'Risk to staff': 'Unknown',
      })
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new Summary({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
