/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApType } from './ApType';
import type { PlacementDates } from './PlacementDates';
import type { PlacementRequirements } from './PlacementRequirements';
/**
 * Information needed to accept an assessment
 */
export type AssessmentAcceptance = {
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document: Record<string, any>;
    requirements?: PlacementRequirements;
    placementDates?: PlacementDates;
    apType?: ApType;
    notes?: string;
};

