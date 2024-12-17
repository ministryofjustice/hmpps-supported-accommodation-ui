/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovedPremisesApplicationStatus } from './ApprovedPremisesApplicationStatus';
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
import type { TimelineEvent } from './TimelineEvent';
export type ApplicationTimeline = {
    id: string;
    createdAt: string;
    isOfflineApplication: boolean;
    timelineEvents: Array<TimelineEvent>;
    status?: ApprovedPremisesApplicationStatus;
    createdBy?: (ApprovedPremisesUser | TemporaryAccommodationUser);
};

