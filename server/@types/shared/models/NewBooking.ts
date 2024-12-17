/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceName } from './ServiceName';
export type NewBooking = {
    crn: string;
    arrivalDate: string;
    departureDate: string;
    serviceName: ServiceName;
    bedId?: string;
    enableTurnarounds?: boolean;
    assessmentId?: string;
    eventNumber?: string;
};

