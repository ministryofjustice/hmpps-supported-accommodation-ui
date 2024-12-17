/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReferralHistoryNoteMessageDetails } from './ReferralHistoryNoteMessageDetails';
export type ReferralHistoryNote = {
    message?: string;
    id: string;
    type: string;
    createdByUserName: string;
    messageDetails?: ReferralHistoryNoteMessageDetails;
    createdAt: string;
};

