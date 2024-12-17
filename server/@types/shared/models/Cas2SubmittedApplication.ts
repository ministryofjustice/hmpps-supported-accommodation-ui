/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cas2Assessment } from './Cas2Assessment';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { FullPerson } from './FullPerson';
import type { NomisUser } from './NomisUser';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type Cas2SubmittedApplication = {
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    createdAt: string;
    schemaVersion: string;
    outdatedSchema: boolean;
    timelineEvents: Array<Cas2TimelineEvent>;
    assessment: Cas2Assessment;
    submittedBy?: NomisUser;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document?: Record<string, any>;
    submittedAt?: string;
    telephoneNumber?: string;
};

