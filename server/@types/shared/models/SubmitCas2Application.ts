/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Information needed to submit an application
 */
export type SubmitCas2Application = {
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    translatedDocument: Record<string, any>;
    /**
     * Id of the application being submitted
     */
    applicationId: string;
    telephoneNumber: string;
    /**
     * First and second preferences for where the accommodation should be located, pipe-separated
     */
    preferredAreas?: string;
    hdcEligibilityDate?: string;
    conditionalReleaseDate?: string;
};

