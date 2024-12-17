/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmitApplication } from './SubmitApplication';
export type SubmitTemporaryAccommodationApplication = (SubmitApplication & {
    arrivalDate?: string;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    summaryData?: Record<string, any>;
    isRegisteredSexOffender?: boolean;
    needsAccessibleProperty?: boolean;
    hasHistoryOfArson?: boolean;
    isDutyToReferSubmitted?: boolean;
    dutyToReferSubmissionDate?: string;
    dutyToReferOutcome?: string;
    isApplicationEligible?: boolean;
    eligibilityReason?: string;
    dutyToReferLocalAuthorityAreaName?: string;
    personReleaseDate?: string;
    pdu?: string;
    probationDeliveryUnitId?: string;
    isHistoryOfSexualOffence?: boolean;
    isConcerningSexualBehaviour?: boolean;
    isConcerningArsonBehaviour?: boolean;
    prisonReleaseTypes?: Array<string>;
} & {
    arrivalDate: string;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    summaryData: Record<string, any>;
});

