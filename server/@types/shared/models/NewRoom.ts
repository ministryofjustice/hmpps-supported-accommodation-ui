/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * details of the new room
 */
export type NewRoom = {
    name: string;
    characteristicIds: Array<string>;
    notes?: string;
    /**
     * End date of the bed availability, open for availability if not specified.
     */
    bedEndDate?: string;
};

