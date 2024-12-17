/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatus } from './ApplicationStatus';
import type { LatestCas2StatusUpdate } from './LatestCas2StatusUpdate';
import type { PersonRisks } from './PersonRisks';
export type Cas2ApplicationSummary = {
    type: string;
    id: string;
    createdAt: string;
    createdByUserId: string;
    status: ApplicationStatus;
    personName: string;
    crn: string;
    nomsNumber: string;
    submittedAt?: string;
    createdByUserName?: string;
    latestStatusUpdate?: LatestCas2StatusUpdate;
    risks?: PersonRisks;
    hdcEligibilityDate?: string;
};

