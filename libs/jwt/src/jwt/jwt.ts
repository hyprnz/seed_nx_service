import * as jwt from 'jsonwebtoken';
import { VerifyOptions } from 'jsonwebtoken';
import { makeLogger } from '@hyprnz/logger';

const logger = makeLogger();

const verifyJWT = (token: string, options: VerifyOptions, getPublicKey: (header: any, callback: any) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        (jwt as any).default.verify(token, getPublicKey, options, (err: any, resultToken: any) => {
            if (err) {
                logger.warn(err);
                return reject(err);
            }
            resolve(resultToken);
        });
    });
};

export { verifyJWT };
