import crypto from 'node:crypto';
import { envs } from './envs';

export const encryptPassword = (password: string) => {
    const hash = crypto.pbkdf2Sync(password, envs['ENCRYPTION_SALT'], 1000, 32, 'sha512').toString('hex');
    return hash;
}

export const comparePassword = (password: string, hash: string) => {
    const hashVerify = encryptPassword(password);
    return hash === hashVerify;
}