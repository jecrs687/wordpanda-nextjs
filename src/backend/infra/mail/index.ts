import mailTransport from '@infra/config/mail';
import { User } from '@prisma/client';
import * as emails from './mails';

export const sendEmail = async (kind: keyof typeof emails, user: User ) => {
    mailTransport.sendMail({
        ...emails[kind](user),
        to: user.email
    })
}
