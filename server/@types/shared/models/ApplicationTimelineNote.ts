/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
export type ApplicationTimelineNote = {
    note: string;
    id?: string;
    createdByUser?: (ApprovedPremisesUser | TemporaryAccommodationUser);
    createdAt?: string;
};

