import nodemailer from 'nodemailer';

export function mailTransport() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        secure: true,
        secureConnection: false, // TLS requires secureConnection to be false
        tls: {
            ciphers: 'SSLv3'
        },
        requireTLS: true,
        port: 465,
        debug: true,
        auth: {
            user: "panda@wordpanda.app",
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

