/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApArea } from './ApArea';
import type { ApprovedPremisesUserPermission } from './ApprovedPremisesUserPermission';
import type { ApprovedPremisesUserRole } from './ApprovedPremisesUserRole';
import type { NamedId } from './NamedId';
import type { User } from './User';
import type { UserQualification } from './UserQualification';
export type ApprovedPremisesUser = (User & {
    qualifications?: Array<UserQualification>;
    roles?: Array<ApprovedPremisesUserRole>;
    apArea?: ApArea;
    cruManagementArea?: NamedId;
    cruManagementAreaDefault?: NamedId;
    permissions?: Array<ApprovedPremisesUserPermission>;
    cruManagementAreaOverride?: NamedId;
    version?: number;
} & {
    qualifications: Array<UserQualification>;
    roles: Array<ApprovedPremisesUserRole>;
    apArea: ApArea;
    cruManagementArea: NamedId;
    cruManagementAreaDefault: NamedId;
});

