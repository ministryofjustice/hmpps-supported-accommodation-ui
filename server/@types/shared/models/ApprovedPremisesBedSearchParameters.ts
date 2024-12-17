/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BedSearchParameters } from './BedSearchParameters';
import type { PlacementCriteria } from './PlacementCriteria';
export type ApprovedPremisesBedSearchParameters = (BedSearchParameters & {
    /**
     * The postcode district to search outwards from
     */
    postcodeDistrict?: string;
    /**
     * Maximum number of miles from the postcode district to search, only required if more than 50 miles which is the default
     */
    maxDistanceMiles?: number;
    requiredCharacteristics?: Array<PlacementCriteria>;
} & {
    /**
     * The postcode district to search outwards from
     */
    postcodeDistrict: string;
    /**
     * Maximum number of miles from the postcode district to search, only required if more than 50 miles which is the default
     */
    maxDistanceMiles: number;
    requiredCharacteristics: Array<PlacementCriteria>;
});

