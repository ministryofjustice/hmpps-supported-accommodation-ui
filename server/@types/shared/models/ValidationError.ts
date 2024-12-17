/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvalidParam } from './InvalidParam';
export type ValidationError = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    'invalid-params'?: Array<InvalidParam>;
};

