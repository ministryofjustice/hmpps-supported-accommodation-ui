/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationSummary } from './ApplicationSummary';
import type { ApprovedPremisesApplicationStatus } from './ApprovedPremisesApplicationStatus';
import type { PersonRisks } from './PersonRisks';
import type { ReleaseTypeOption } from './ReleaseTypeOption';
export type ApprovedPremisesApplicationSummary = (ApplicationSummary & {
    createdByUserId?: string;
    status?: ApprovedPremisesApplicationStatus;
    isWithdrawn?: boolean;
    hasRequestsForPlacement?: boolean;
    isWomensApplication?: boolean;
    isPipeApplication?: boolean;
    isEmergencyApplication?: boolean;
    isEsapApplication?: boolean;
    arrivalDate?: string;
    risks?: PersonRisks;
    tier?: string;
    releaseType?: ReleaseTypeOption;
} & {
    createdByUserId: string;
    status: ApprovedPremisesApplicationStatus;
    isWithdrawn: boolean;
    hasRequestsForPlacement: boolean;
});

