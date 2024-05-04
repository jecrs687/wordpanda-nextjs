import mailTransport from '@infra/config/mail';
import { User } from '@prisma/client';
import * as emails from './mails';

export const sendEmail = async (kind: keyof typeof emails, user: User, options ) => {
    mailTransport.sendMail({
        ...emails[kind](user, options),
        to: user.email
    })
}
