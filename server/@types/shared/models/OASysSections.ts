/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArrayOfOASysOffenceDetailsQuestions } from './ArrayOfOASysOffenceDetailsQuestions';
import type { ArrayOfOASysRiskManagementPlanQuestions } from './ArrayOfOASysRiskManagementPlanQuestions';
import type { ArrayOfOASysRiskOfSeriousHarmSummaryQuestions } from './ArrayOfOASysRiskOfSeriousHarmSummaryQuestions';
import type { ArrayOfOASysRiskToSelfQuestions } from './ArrayOfOASysRiskToSelfQuestions';
import type { ArrayOfOASysSupportingInformationQuestions } from './ArrayOfOASysSupportingInformationQuestions';
import type { OASysAssessmentId } from './OASysAssessmentId';
import type { OASysAssessmentState } from './OASysAssessmentState';

export type OASysSections = {
    assessmentId: OASysAssessmentId;
    assessmentState: OASysAssessmentState;
    dateStarted: string;
    dateCompleted?: string;
    offenceDetails: ArrayOfOASysOffenceDetailsQuestions;
    roshSummary: ArrayOfOASysRiskOfSeriousHarmSummaryQuestions;
    supportingInformation: ArrayOfOASysSupportingInformationQuestions;
    riskToSelf: ArrayOfOASysRiskToSelfQuestions;
    riskManagementPlan: ArrayOfOASysRiskManagementPlanQuestions;
};

