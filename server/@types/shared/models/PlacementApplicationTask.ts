/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementApplicationDecision } from './PlacementApplicationDecision';
import type { PlacementDates } from './PlacementDates';
import type { PlacementType } from './PlacementType';
import type { ReleaseTypeOption } from './ReleaseTypeOption';
import type { RiskTierEnvelope } from './RiskTierEnvelope';
import type { Task } from './Task';
export type PlacementApplicationTask = (Task & {
    tier?: RiskTierEnvelope;
    releaseType?: ReleaseTypeOption;
    placementType?: PlacementType;
    placementDates?: Array<PlacementDates>;
    outcome?: PlacementApplicationDecision;
} & {
    tier: RiskTierEnvelope;
    releaseType: ReleaseTypeOption;
    placementType: PlacementType;
});

