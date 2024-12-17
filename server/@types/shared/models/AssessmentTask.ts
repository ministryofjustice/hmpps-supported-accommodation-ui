/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentDecision } from './AssessmentDecision';
import type { Task } from './Task';
export type AssessmentTask = (Task & {
    createdFromAppeal?: boolean;
    outcome?: AssessmentDecision;
} & {
    createdFromAppeal: boolean;
});

