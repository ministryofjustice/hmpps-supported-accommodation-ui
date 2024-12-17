/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BedSearchAttributes } from './BedSearchAttributes';
import type { BedSearchParameters } from './BedSearchParameters';
export type TemporaryAccommodationBedSearchParameters = (BedSearchParameters & {
    /**
     * The list of pdus Ids to search within
     */
    probationDeliveryUnits?: Array<string>;
    /**
     * Bedspace and property attributes to filter on
     */
    attributes?: Array<BedSearchAttributes>;
} & {
    /**
     * The list of pdus Ids to search within
     */
    probationDeliveryUnits: Array<string>;
});

