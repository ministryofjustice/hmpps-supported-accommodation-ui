/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApArea } from './ApArea';
import type { ApprovedPremisesUserRole } from './ApprovedPremisesUserRole';
import type { NamedId } from './NamedId';
import type { ProbationDeliveryUnit } from './ProbationDeliveryUnit';
import type { ProbationRegion } from './ProbationRegion';
import type { UserQualification } from './UserQualification';
/**
 * Users to whom this task can be allocated
 */
export type UserWithWorkload = {
    service: string;
    id: string;
    name: string;
    deliusUsername: string;
    region: ProbationRegion;
    numTasksPending?: number;
    numTasksCompleted7Days?: number;
    numTasksCompleted30Days?: number;
    qualifications?: Array<UserQualification>;
    roles?: Array<ApprovedPremisesUserRole>;
    apArea?: ApArea;
    cruManagementArea?: NamedId;
    email?: string;
    telephoneNumber?: string;
    isActive?: boolean;
    probationDeliveryUnit?: ProbationDeliveryUnit;
};

