import { ServiceSection } from '@approved-premises/ui'

import applyPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportsPaths from '../paths/report'
import config from '../config'

export const sections = {
  referral: {
    id: 'referrals',
    title: 'View referrals',
    description: 'View all in progress and submitted CAS-2 referrals.',
    shortTitle: 'Referrals',
    href: applyPaths.applications.index({}),
  },
  newReferral: {
    id: 'new-referral',
    title: 'Start a new referral',
    description: 'Start a new CAS-2 referral for a HDC applicant.',
    shortTitle: 'New referral',
    href: applyPaths.applications.beforeYouStart({}),
  },
  submittedApplications: {
    id: 'submitted-applications',
    title: 'Submitted applications',
    description: 'View all CAS-2 submitted applications',
    shortTitle: 'Submitted applications',
    href: assessPaths.submittedApplications.index.pattern,
  },
  managementInformationReports: {
    id: 'management-information-reports',
    title: 'Management information reports',
    description: 'View all CAS-2 management information reports to download',
    shortTitle: 'Management information reports',
    href: reportsPaths.report.new.pattern,
  },
  prisonDashboard: {
    id: 'prison-dashboard',
    title: 'View my prison’s referrals',
    description: 'View recently submitted CAS-2 referrals from your prison.',
    shortTitle: 'View my prison’s referrals',
    href: reportsPaths.report.new.pattern,
  },
}

export const hasRole = (userRoles: Array<string>, role: string): boolean => {
  return userRoles.includes(role)
}

export const sectionsForUser = (userRoles: Array<string>): Array<ServiceSection> => {
  const items = []

  if (hasRole(userRoles, 'ROLE_POM')) {
    items.push(sections.referral)
    items.push(sections.newReferral)
    if (config.flags.prisonDashboardEnabled) {
      items.push(sections.prisonDashboard)
    }
  }
  if (hasRole(userRoles, 'ROLE_CAS2_ADMIN')) {
    items.push(sections.submittedApplications)
  }
  if (hasRole(userRoles, 'ROLE_CAS2_MI')) {
    items.push(sections.managementInformationReports)
  }

  return Array.from(new Set(items))
}
