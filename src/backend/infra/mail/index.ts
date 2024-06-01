import { mailTransport } from '@infra/config/mail';
import { User } from '@prisma/client';
import * as emails from './mails';

export const sendEmail = async (kind: keyof typeof emails, user: User, options?: any) => {
    await new Promise((resolve, reject) => {
        const content = emails[kind](user, options);
        mailTransport().sendMail({
            ...content,
            to: options?.to || user.email
        }, async (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });

    return;

}
