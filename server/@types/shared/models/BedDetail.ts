/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BedStatus } from './BedStatus';
import type { CharacteristicPair } from './CharacteristicPair';
export type BedDetail = {
    id: string;
    name: string;
    roomName: string;
    status: BedStatus;
    characteristics: Array<CharacteristicPair>;
};

