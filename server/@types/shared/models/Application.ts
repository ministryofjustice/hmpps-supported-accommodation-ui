/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Person } from './Person';

export type Application = {
    id: string;
    person: Person;
    createdAt: string;
    submittedAt?: string;
};

