/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bed } from './Bed';
import type { BookingStatus } from './BookingStatus';
import type { FullPerson } from './FullPerson';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type PremisesBooking = {
    id?: string;
    arrivalDate?: string;
    departureDate?: string;
    person?: (FullPerson | RestrictedPerson | UnknownPerson);
    bed?: Bed;
    status?: BookingStatus;
};

