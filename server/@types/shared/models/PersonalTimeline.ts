/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationTimeline } from './ApplicationTimeline';
import type { FullPerson } from './FullPerson';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type PersonalTimeline = {
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    applications: Array<ApplicationTimeline>;
};

