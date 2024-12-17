/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
import type { TimelineEventAssociatedUrl } from './TimelineEventAssociatedUrl';
import type { TimelineEventType } from './TimelineEventType';
import type { TriggerSourceType } from './TriggerSourceType';
export type TimelineEvent = {
    type?: TimelineEventType;
    id?: string;
    occurredAt?: string;
    content?: string;
    createdBy?: (ApprovedPremisesUser | TemporaryAccommodationUser);
    associatedUrls?: Array<TimelineEventAssociatedUrl>;
    triggerSource?: TriggerSourceType;
};

