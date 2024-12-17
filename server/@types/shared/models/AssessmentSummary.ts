/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentDecision } from './AssessmentDecision';
import type { FullPerson } from './FullPerson';
import type { PersonRisks } from './PersonRisks';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type AssessmentSummary = {
    id: string;
    type: string;
    dateOfInfoRequest?: string;
    applicationId: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    risks?: PersonRisks;
    arrivalDate?: string;
    decision?: AssessmentDecision;
    createdAt: string;
};

