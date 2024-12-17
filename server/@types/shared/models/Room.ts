/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bed } from './Bed';
import type { Characteristic } from './Characteristic';
export type Room = {
    id: string;
    name: string;
    characteristics: Array<Characteristic>;
    code?: string;
    notes?: string;
    beds?: Array<Bed>;
};

