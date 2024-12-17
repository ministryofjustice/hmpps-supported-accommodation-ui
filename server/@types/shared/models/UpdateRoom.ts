/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Information to update the room with
 */
export type UpdateRoom = {
    characteristicIds: Array<string>;
    notes?: string;
    name?: string;
    /**
     * End date of the bed availability, open for availability if not specified
     */
    bedEndDate?: string;
};

