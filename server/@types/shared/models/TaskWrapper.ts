/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentTask } from './AssessmentTask';
import type { BookingAppealTask } from './BookingAppealTask';
import type { PlacementApplicationTask } from './PlacementApplicationTask';
import type { PlacementRequestTask } from './PlacementRequestTask';
import type { UserWithWorkload } from './UserWithWorkload';
export type TaskWrapper = {
    task: (AssessmentTask | BookingAppealTask | PlacementApplicationTask | PlacementRequestTask);
    /**
     * Users to whom this task can be allocated
     */
    users: Array<UserWithWorkload>;
};

