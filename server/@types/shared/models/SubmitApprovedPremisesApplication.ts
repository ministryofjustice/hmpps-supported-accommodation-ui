/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApType } from './ApType';
import type { Cas1ApplicationTimelinessCategory } from './Cas1ApplicationTimelinessCategory';
import type { Cas1ApplicationUserDetails } from './Cas1ApplicationUserDetails';
import type { ReleaseTypeOption } from './ReleaseTypeOption';
import type { SentenceTypeOption } from './SentenceTypeOption';
import type { SituationOption } from './SituationOption';
import type { SubmitApplication } from './SubmitApplication';
export type SubmitApprovedPremisesApplication = (SubmitApplication & {
    targetLocation?: string;
    releaseType?: ReleaseTypeOption;
    sentenceType?: SentenceTypeOption;
    /**
     * Use apType
     */
    isPipeApplication?: boolean;
    isWomensApplication?: boolean;
    /**
     * noticeType should be used to indicate if this an emergency application
     */
    isEmergencyApplication?: boolean;
    /**
     * Use apType
     */
    isEsapApplication?: boolean;
    apType?: ApType;
    situation?: SituationOption;
    arrivalDate?: string;
    /**
     * If the user's ap area id is incorrect, they can optionally override it for the application
     */
    apAreaId?: string;
    applicantUserDetails?: Cas1ApplicationUserDetails;
    caseManagerIsNotApplicant?: boolean;
    caseManagerUserDetails?: Cas1ApplicationUserDetails;
    noticeType?: Cas1ApplicationTimelinessCategory;
    reasonForShortNotice?: string;
    reasonForShortNoticeOther?: string;
    licenseExpiryDate?: string;
} & {
    targetLocation: string;
    releaseType: ReleaseTypeOption;
    sentenceType: SentenceTypeOption;
});

