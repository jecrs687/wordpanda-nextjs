import welcome from "@assets/templates/welcome.html";
import { saveOtp } from "@infra/cache/otp";
import { User } from "@prisma/client";
export const WELCOME_MAIL = (user: User, _: any) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    saveOtp(user.id, otp);
    const htmlFormatted = eval('`' + welcome + '`');
    console.log('OTP:', otp);
    return {
        subject: `Bem vindo ao mundo wordpanda, ${user.firstName} ${user.lastName}!!!`,
        from: 'panda@wordpanda.app',
        attachments: [{
            filename: 'panda.gif',
            path: 'https://media.tenor.com/xaJrTrfiRcEAAAAM/happy-panda-bamboo.gif',
            cid: 'panda'
        }],
        html: htmlFormatted,
    }
}