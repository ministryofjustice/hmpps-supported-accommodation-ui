/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Assessment } from './Assessment';
import type { TemporaryAccommodationApplication } from './TemporaryAccommodationApplication';
import type { TemporaryAccommodationAssessmentStatus } from './TemporaryAccommodationAssessmentStatus';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
export type TemporaryAccommodationAssessment = (Assessment & {
    application?: TemporaryAccommodationApplication;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    summaryData?: Record<string, any>;
    allocatedToStaffMember?: TemporaryAccommodationUser;
    status?: TemporaryAccommodationAssessmentStatus;
    releaseDate?: string;
    accommodationRequiredFromDate?: string;
} & {
    application: TemporaryAccommodationApplication;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    summaryData: Record<string, any>;
});

