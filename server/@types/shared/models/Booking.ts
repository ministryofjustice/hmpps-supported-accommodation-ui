/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Arrival } from './Arrival';
import type { Bed } from './Bed';
import type { BookingPremisesSummary } from './BookingPremisesSummary';
import type { BookingStatus } from './BookingStatus';
import type { Cancellation } from './Cancellation';
import type { Confirmation } from './Confirmation';
import type { Departure } from './Departure';
import type { Extension } from './Extension';
import type { FullPerson } from './FullPerson';
import type { Nonarrival } from './Nonarrival';
import type { RestrictedPerson } from './RestrictedPerson';
import type { ServiceName } from './ServiceName';
import type { StaffMember } from './StaffMember';
import type { Turnaround } from './Turnaround';
import type { UnknownPerson } from './UnknownPerson';
export type Booking = {
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    arrivalDate: string;
    originalArrivalDate: string;
    departureDate: string;
    originalDepartureDate: string;
    createdAt: string;
    serviceName: ServiceName;
    status: BookingStatus;
    extensions: Array<Extension>;
    /**
     * The full history of the departure
     */
    departures: Array<Departure>;
    /**
     * The full history of the cancellation
     */
    cancellations: Array<Cancellation>;
    premises: BookingPremisesSummary;
    keyWorker?: StaffMember;
    bed?: Bed;
    arrival?: Arrival;
    departure?: Departure;
    nonArrival?: Nonarrival;
    cancellation?: Cancellation;
    confirmation?: Confirmation;
    turnaround?: Turnaround;
    /**
     * The full history of turnarounds
     */
    turnarounds?: Array<Turnaround>;
    turnaroundStartDate?: string;
    effectiveEndDate?: string;
    applicationId?: string;
    assessmentId?: string;
};

