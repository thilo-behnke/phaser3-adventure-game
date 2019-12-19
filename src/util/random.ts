import * as uuid from 'uuid/v1';

export const generateUUID = (): string => {
    return uuid();
};

export const getNumberBetween = (max: number, min = 1) => {
    const rand = Math.random();
    return rand * (max - min) + min;
};
