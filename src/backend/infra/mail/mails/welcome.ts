import { User } from "@prisma/client";

export const WELCOME_MAIL = (user: User) => ({
    subject: 'Welcome to wordpanda!!!',
    from: 'panda@wordpanda.app',
    attachments: [{
        filename: 'logo.png',
        path: __dirname + '/public/assets/logo.png',
        cid: 'logo'
    }],
    html: `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="cid:logo" alt="Logo">
                </div>
                <h1>Welcome to wordpanda, ${user.firstName}!!!</h1>
            </div>
            <div class="content">
                <p>
                    We are happy to have you here. You can now start learning new words and improve your vocabulary.
                </p>
                <p>
                    If you have any questions, feel free to contact us at < href="mailto:panda@wordpanda.app">
                    mail us </a>
                </p>
            </div>
            <div class="footer">
                <p>
                    Thanks for joining us.
                </p>
            </div>
        </div>
    </body>
    </html>
    `,

})