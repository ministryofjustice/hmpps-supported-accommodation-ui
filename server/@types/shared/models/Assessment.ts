/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentDecision } from './AssessmentDecision';
import type { ClarificationNote } from './ClarificationNote';
import type { ReferralHistoryDomainEventNote } from './ReferralHistoryDomainEventNote';
import type { ReferralHistorySystemNote } from './ReferralHistorySystemNote';
import type { ReferralHistoryUserNote } from './ReferralHistoryUserNote';
export type Assessment = {
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    data?: Record<string, any>;
    id: string;
    outdatedSchema: boolean;
    clarificationNotes: Array<ClarificationNote>;
    rejectionRationale?: string;
    schemaVersion: string;
    allocatedAt?: string;
    submittedAt?: string;
    decision?: AssessmentDecision;
    createdAt: string;
    service: string;
    referralHistoryNotes?: Array<(ReferralHistoryDomainEventNote | ReferralHistorySystemNote | ReferralHistoryUserNote)>;
};

