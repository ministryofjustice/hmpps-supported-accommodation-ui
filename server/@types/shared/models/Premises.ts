/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApArea } from './ApArea';
import type { Characteristic } from './Characteristic';
import type { LocalAuthorityArea } from './LocalAuthorityArea';
import type { ProbationRegion } from './ProbationRegion';
import type { PropertyStatus } from './PropertyStatus';
export type Premises = {
    name: string;
    id: string;
    characteristics?: Array<Characteristic>;
    localAuthorityArea?: LocalAuthorityArea;
    addressLine1: string;
    addressLine2?: string;
    probationRegion: ProbationRegion;
    apArea: ApArea;
    notes?: string;
    town?: string;
    postcode: string;
    bedCount: number;
    service: string;
    status: PropertyStatus;
    availableBedsForToday: number;
};

