/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LostBedCancellation } from './LostBedCancellation';
import type { LostBedReason } from './LostBedReason';
import type { LostBedStatus } from './LostBedStatus';
export type LostBed = {
    id: string;
    startDate: string;
    endDate: string;
    bedId: string;
    bedName: string;
    roomName: string;
    reason: LostBedReason;
    status: LostBedStatus;
    referenceNumber?: string;
    notes?: string;
    cancellation?: LostBedCancellation;
};

