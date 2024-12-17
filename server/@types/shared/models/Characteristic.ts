/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModelScope } from './ModelScope';
import type { ServiceScope } from './ServiceScope';
export type Characteristic = {
    id: string;
    name: string;
    serviceScope: ServiceScope;
    modelScope: ModelScope;
    propertyName?: string;
};

