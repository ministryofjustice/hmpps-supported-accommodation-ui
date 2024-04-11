import config from '../config'
import { sectionsForUser, sections } from './userUtils'

describe('userUtils', () => {
  describe('sectionsForUser', () => {
    it('should return an empty array for a user with no roles', () => {
      expect(sectionsForUser([])).toEqual([])
    })

    describe('when prison dashboard is enabled', () => {
      it('should return correct sections including the prison dashboard for a POM', () => {
        config.flags.prisonDashboardEnabled = true
        const expected = [sections.referral, sections.newReferral, sections.prisonDashboard]
        expect(sectionsForUser(['ROLE_POM'])).toEqual(expected)
      })
    })

    describe('when prison dashboard is NOT enabled', () => {
      it('should return correct sections without prison dashboard for a POM', () => {
        config.flags.prisonDashboardEnabled = false
        const expected = [sections.referral, sections.newReferral]
        expect(sectionsForUser(['ROLE_POM'])).toEqual(expected)
      })
    })

    it('should return correct sections for an admin', () => {
      const expected = [sections.submittedApplications]
      expect(sectionsForUser(['ROLE_CAS2_ADMIN'])).toEqual(expected)
    })

    it('should return correct sections for a management information user', () => {
      const expected = [sections.managementInformationReports]
      expect(sectionsForUser(['ROLE_CAS2_MI'])).toEqual(expected)
    })
  })
})
