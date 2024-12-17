/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Person } from './Person';
import type { PersonStatus } from './PersonStatus';
export type FullPerson = (Person & {
    name?: string;
    dateOfBirth?: string;
    sex?: string;
    status?: PersonStatus;
    nomsNumber?: string;
    pncNumber?: string;
    ethnicity?: string;
    nationality?: string;
    religionOrBelief?: string;
    genderIdentity?: string;
    prisonName?: string;
    isRestricted?: boolean;
} & {
    name: string;
    dateOfBirth: string;
    sex: string;
    status: PersonStatus;
});

