/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OASysAssessmentState } from './OASysAssessmentState';
import type { OASysQuestion } from './OASysQuestion';
export type OASysRiskToSelf = {
    /**
     * The ID of assessment being used. This should always be the latest Layer 3 assessment, regardless of state.
     */
    assessmentId: number;
    assessmentState: OASysAssessmentState;
    dateStarted: string;
    riskToSelf: Array<OASysQuestion>;
    dateCompleted?: string;
};

