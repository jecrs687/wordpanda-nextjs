import mailTransport from '@infra/config/mail';
import { User } from '@prisma/client';
import * as emails from './mails';

export const sendEmail = 
async (kind: keyof typeof emails, user: User, options ) => {
    await new Promise((resolve, reject) => {
        mailTransport.sendMail({
            ...emails[kind](user, options),
            to: user.email
        }, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });

}
