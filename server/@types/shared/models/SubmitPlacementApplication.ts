/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementDates } from './PlacementDates';
import type { PlacementType } from './PlacementType';
/**
 * Information needed to submit a placement application
 */
export type SubmitPlacementApplication = {
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    translatedDocument: Record<string, any>;
    placementType: PlacementType;
    placementDates: Array<PlacementDates>;
};

