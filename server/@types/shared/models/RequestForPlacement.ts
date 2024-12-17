/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementDates } from './PlacementDates';
import type { RequestForPlacementStatus } from './RequestForPlacementStatus';
import type { RequestForPlacementType } from './RequestForPlacementType';
import type { WithdrawPlacementRequestReason } from './WithdrawPlacementRequestReason';
export type RequestForPlacement = {
    /**
     * If `type` is `"manual"`, provides the `PlacementApplication` ID. If `type` is `"automatic"` this field provides a `PlacementRequest` ID.
     */
    id: string;
    createdByUserId: string;
    createdAt: string;
    /**
     * If true, the user making this request can withdraw this request for placement.  If false, it may still be possible to indirectly withdraw this request for placement by withdrawing the application.
     */
    canBeDirectlyWithdrawn: boolean;
    isWithdrawn: boolean;
    type: RequestForPlacementType;
    placementDates: Array<PlacementDates>;
    status: RequestForPlacementStatus;
    submittedAt?: string;
    /**
     * If `type` is `"manual"`, provides the value of `PlacementApplication.decisionMadeAt`. If `type` is `"automatic"` this field provides the value of `PlacementRequest.assessmentCompletedAt`.
     */
    requestReviewedAt?: string;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document?: Record<string, any>;
    withdrawalReason?: WithdrawPlacementRequestReason;
};

