/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepartureReason } from './DepartureReason';
import type { DestinationProvider } from './DestinationProvider';
import type { MoveOnCategory } from './MoveOnCategory';
/**
 * The latest version of the departure, if it exists
 */
export type Departure = {
    id: string;
    bookingId: string;
    dateTime: string;
    reason: DepartureReason;
    moveOnCategory: MoveOnCategory;
    createdAt: string;
    notes?: string;
    destinationProvider?: DestinationProvider;
};

