/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancellationReason } from './CancellationReason';
/**
 * The latest version of the cancellation, if it exists
 */
export type Cancellation = {
    bookingId: string;
    date: string;
    reason: CancellationReason;
    createdAt: string;
    premisesName: string;
    id?: string;
    notes?: string;
    otherReason?: string;
};

