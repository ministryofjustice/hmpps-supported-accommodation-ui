/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Rejection info
 */
export type AssessmentRejection = {
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document: Record<string, any>;
    rejectionRationale: string;
    referralRejectionReasonId?: string;
    referralRejectionReasonDetail?: string;
    isWithdrawn?: boolean;
};

