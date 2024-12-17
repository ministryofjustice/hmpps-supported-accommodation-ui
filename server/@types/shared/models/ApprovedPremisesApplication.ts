/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApArea } from './ApArea';
import type { ApprovedPremisesApplicationStatus } from './ApprovedPremisesApplicationStatus';
import type { ApType } from './ApType';
import type { AssessmentDecision } from './AssessmentDecision';
import type { Cas1ApplicationUserDetails } from './Cas1ApplicationUserDetails';
import type { Cas1CruManagementArea } from './Cas1CruManagementArea';
import type { FullPerson } from './FullPerson';
import type { PersonRisks } from './PersonRisks';
import type { PersonStatus } from './PersonStatus';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type ApprovedPremisesApplication = {
    createdByUserId: string;
    schemaVersion: string;
    outdatedSchema: boolean;
    status: ApprovedPremisesApplicationStatus;
    type: string;
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    createdAt: string;
    isWomensApplication?: boolean;
    /**
     * Use apType
     */
    isPipeApplication?: boolean;
    isEmergencyApplication?: boolean;
    /**
     * Use apType
     */
    isEsapApplication?: boolean;
    apType?: ApType;
    arrivalDate?: string;
    risks?: PersonRisks;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    data?: Record<string, any>;
    /**
     * Any object that conforms to the current JSON schema for an application
     */
    document?: Record<string, any>;
    assessmentId?: string;
    assessmentDecision?: AssessmentDecision;
    assessmentDecisionDate?: string;
    submittedAt?: string;
    personStatusOnSubmission?: PersonStatus;
    apArea?: ApArea;
    cruManagementArea?: Cas1CruManagementArea;
    applicantUserDetails?: Cas1ApplicationUserDetails;
    /**
     * If true, caseManagerUserDetails will provide case manager details. Otherwise, applicantUserDetails can be used for case manager details
     */
    caseManagerIsNotApplicant?: boolean;
    caseManagerUserDetails?: Cas1ApplicationUserDetails;
    licenceExpiryDate?: string;
};

