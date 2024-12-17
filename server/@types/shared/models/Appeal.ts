/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppealDecision } from './AppealDecision';
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
export type Appeal = {
    id: string;
    appealDate: string;
    appealDetail: string;
    decision: AppealDecision;
    decisionDetail: string;
    createdAt: string;
    applicationId: string;
    createdByUser: (ApprovedPremisesUser | TemporaryAccommodationUser);
    assessmentId?: string;
};

