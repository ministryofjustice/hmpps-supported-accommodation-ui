/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnyValue } from './AnyValue';
import type { UpdateApplicationType } from './UpdateApplicationType';

export type UpdateApplication = {
    type: UpdateApplicationType;
    data: Record<string, AnyValue>;
};

