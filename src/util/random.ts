import * as uuid from 'uuid/v1';

export const generateUUID = (): string => {
    return uuid();
};

export const getRandomNumber = () => {
    return Math.random();
};

export const getRandomNumberBetween = (max: number, min = 1) => {
    const rand = Math.random();
    return Math.ceil(rand * (max - min) + min);
};
