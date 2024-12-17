/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovedPremisesApplication } from './ApprovedPremisesApplication';
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { ApType } from './ApType';
import type { AssessmentDecision } from './AssessmentDecision';
import type { BookingSummary } from './BookingSummary';
import type { Cancellation } from './Cancellation';
import type { Cas2Application } from './Cas2Application';
import type { FullPerson } from './FullPerson';
import type { Gender } from './Gender';
import type { OfflineApplication } from './OfflineApplication';
import type { PersonRisks } from './PersonRisks';
import type { PlacementCriteria } from './PlacementCriteria';
import type { PlacementRequestRequestType } from './PlacementRequestRequestType';
import type { PlacementRequestStatus } from './PlacementRequestStatus';
import type { ReleaseTypeOption } from './ReleaseTypeOption';
import type { RestrictedPerson } from './RestrictedPerson';
import type { TemporaryAccommodationApplication } from './TemporaryAccommodationApplication';
import type { UnknownPerson } from './UnknownPerson';
import type { WithdrawPlacementRequestReason } from './WithdrawPlacementRequestReason';
export type PlacementRequestDetail = {
    gender: Gender;
    type: ApType;
    location: string;
    radius: number;
    essentialCriteria: Array<PlacementCriteria>;
    desirableCriteria: Array<PlacementCriteria>;
    expectedArrival: string;
    duration: number;
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    risks: PersonRisks;
    applicationId: string;
    assessmentId: string;
    releaseType: ReleaseTypeOption;
    status: PlacementRequestStatus;
    assessmentDecision: AssessmentDecision;
    assessmentDate: string;
    applicationDate: string;
    assessor: ApprovedPremisesUser;
    isParole: boolean;
    isWithdrawn: boolean;
    /**
     * Not used by UI. Space Booking cancellations to be provided if cancellations are required in future.
     */
    cancellations: Array<Cancellation>;
    application: (ApprovedPremisesApplication | Cas2Application | OfflineApplication | TemporaryAccommodationApplication);
    notes?: string;
    booking?: BookingSummary;
    requestType?: PlacementRequestRequestType;
    withdrawalReason?: WithdrawPlacementRequestReason;
};

