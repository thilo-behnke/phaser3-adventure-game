import * as uuid from 'uuid/v1';

export const generateUUID = (): string => {
    return uuid();
};
