/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';
import type { UserQualification } from './UserQualification';

export type ApprovedPremisesUser = (User & {
    name: string;
    deliusUsername: string;
    email?: string;
    telephoneNumber?: string;
    qualifications: Array<UserQualification>;
});

