/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertyStatus } from './PropertyStatus';
export type NewPremises = {
    name: string;
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
};

