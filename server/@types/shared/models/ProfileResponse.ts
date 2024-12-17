/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { LoadError } from './LoadError';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
export type ProfileResponse = {
    deliusUsername: string;
    loadError?: LoadError;
    user?: (ApprovedPremisesUser | TemporaryAccommodationUser);
};

