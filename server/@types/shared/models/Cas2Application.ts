/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Application } from './Application';
import type { ApplicationStatus } from './ApplicationStatus';
import type { Cas2Assessment } from './Cas2Assessment';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { NomisUser } from './NomisUser';
export type Cas2Application = (Application & {
    createdBy?: NomisUser;
    schemaVersion?: string;
    outdatedSchema?: boolean;
    status?: ApplicationStatus;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    data?: Record<string, any>;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document?: Record<string, any>;
    submittedAt?: string;
    telephoneNumber?: string;
    assessment?: Cas2Assessment;
    timelineEvents?: Array<Cas2TimelineEvent>;
} & {
    createdBy: NomisUser;
    schemaVersion: string;
    outdatedSchema: boolean;
    status: ApplicationStatus;
});

