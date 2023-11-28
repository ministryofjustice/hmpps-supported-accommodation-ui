import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import HDCLicenceDates from './hdcLicenceDates'

describe('HDCLicenceDates', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HDCLicenceDates({}, application)

      expect(page.title).toEqual("Roger Smith's Home Detention Curfew (HDC) licence dates")
    })
  })

  itShouldHavePreviousValue(new HDCLicenceDates({}, application), 'taskList')
  itShouldHaveNextValue(new HDCLicenceDates({}, application), '')

  describe('errors', () => {
    describe('when they have not provided any answer', () => {
      it('returns errors', () => {
        const page = new HDCLicenceDates({}, application)
        expect(page.errors()).toEqual({
          hdcEligibilityDate: "Enter the applicant's HDC eligibility date",
          conditionalReleaseDate: "Enter the applicant's conditional release date",
        })
      })
    })
  })
})
