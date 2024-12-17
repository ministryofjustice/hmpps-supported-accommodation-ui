/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatus } from './ApplicationStatus';
import type { FullPerson } from './FullPerson';
import type { PersonRisks } from './PersonRisks';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type TemporaryAccommodationApplication = {
    createdByUserId: string;
    schemaVersion: string;
    outdatedSchema: boolean;
    status: ApplicationStatus;
    offenceId: string;
    type: string;
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    createdAt: string;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    data?: Record<string, any>;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document?: Record<string, any>;
    risks?: PersonRisks;
    submittedAt?: string;
    arrivalDate?: string;
    assessmentId?: string;
};

