/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProbationDeliveryUnit } from './ProbationDeliveryUnit';
import type { ProbationRegion } from './ProbationRegion';
export type User = {
    region: ProbationRegion;
    isActive?: boolean;
    name: string;
    id: string;
    deliusUsername: string;
    telephoneNumber?: string;
    email?: string;
    service: string;
    probationDeliveryUnit?: ProbationDeliveryUnit;
};

