/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentSummary } from './AssessmentSummary';
import type { TemporaryAccommodationAssessmentStatus } from './TemporaryAccommodationAssessmentStatus';
export type TemporaryAccommodationAssessmentSummary = (AssessmentSummary & {
    status?: TemporaryAccommodationAssessmentStatus;
    probationDeliveryUnitName?: string;
} & {
    status: TemporaryAccommodationAssessmentStatus;
});

