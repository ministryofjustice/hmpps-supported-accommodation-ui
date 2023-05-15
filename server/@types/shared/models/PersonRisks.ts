/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlagsEnvelope } from './FlagsEnvelope';
import type { MappaEnvelope } from './MappaEnvelope';
import type { RiskTierEnvelope } from './RiskTierEnvelope';
import type { RoshRisksEnvelope } from './RoshRisksEnvelope';

export type PersonRisks = {
    crn: string;
    roshRisks: RoshRisksEnvelope;
    mappa?: MappaEnvelope;
    tier: RiskTierEnvelope;
    flags: FlagsEnvelope;
};

