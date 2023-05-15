/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Person = {
    crn: string;
    name: string;
    dateOfBirth: string;
    nomsNumber?: string;
    nationality?: string;
    religionOrBelief?: string;
    sex: string;
    genderIdentity?: string;
    status: 'InCustody' | 'InCommunity';
    prisonName?: string;
};

