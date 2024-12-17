/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertyStatus } from './PropertyStatus';
/**
 * Information to update the premises with
 */
export type UpdatePremises = {
    addressLine1: string;
    postcode: string;
    probationRegionId: string;
    characteristicIds: Array<string>;
    status: PropertyStatus;
    addressLine2?: string;
    town?: string;
    notes?: string;
    localAuthorityAreaId?: string;
    pdu?: string;
    probationDeliveryUnitId?: string;
    turnaroundWorkingDayCount?: number;
    name?: string;
};

