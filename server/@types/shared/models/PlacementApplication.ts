/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementApplicationType } from './PlacementApplicationType';
import type { PlacementDates } from './PlacementDates';
import type { WithdrawPlacementRequestReason } from './WithdrawPlacementRequestReason';
export type PlacementApplication = {
    applicationId: string;
    /**
     * If type is 'Additional', provides the PlacementApplication ID. If type is 'Initial' this field provides a PlacementRequest ID.
     */
    id: string;
    createdByUserId: string;
    schemaVersion: string;
    createdAt: string;
    /**
     * If type is 'Additional', provides the PlacementApplication ID. If type is 'Initial' this field shouldn't be used.
     */
    assessmentId: string;
    assessmentCompletedAt: string;
    applicationCompletedAt: string;
    canBeWithdrawn: boolean;
    isWithdrawn: boolean;
    type: PlacementApplicationType;
    placementDates: Array<PlacementDates>;
    outdatedSchema?: boolean;
    submittedAt?: string;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    data?: Record<string, any>;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document?: Record<string, any>;
    withdrawalReason?: WithdrawPlacementRequestReason;
};

