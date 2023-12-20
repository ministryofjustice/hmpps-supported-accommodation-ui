import { ServiceSection } from '@approved-premises/ui'

import paths from '../paths/apply'

export const sections = {
  referral: {
    id: 'referrals',
    title: 'View referrals',
    description: 'View all in progress and submitted referrals.',
    shortTitle: 'Referrals',
    href: paths.applications.index({}),
  },
  newReferral: {
    id: 'new-referral',
    title: 'New referral',
    description: 'Make a new CAS-2 referral.',
    shortTitle: 'New referral',
    href: paths.applications.beforeYouStart({}),
  },
}

export const hasRole = (userRoles: Array<string>, role: string): boolean => {
  return (userRoles || []).includes(role)
}

export const sectionsForUser = (userRoles: Array<string>): Array<ServiceSection> => {
  const items = []

  if (hasRole(userRoles, 'ROLE_POM') || hasRole(userRoles, 'ROLE_CAS2_ADMIN')) {
    items.push(sections.referral)
    items.push(sections.newReferral)
  }

  return Array.from(new Set(items))
}