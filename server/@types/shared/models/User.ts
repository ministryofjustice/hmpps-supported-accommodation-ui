/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProbationRegion } from './ProbationRegion';
import type { UserRole } from './UserRole';

export type User = {
    id: string;
    region: ProbationRegion;
    roles: Array<UserRole>;
    service: string;
};

