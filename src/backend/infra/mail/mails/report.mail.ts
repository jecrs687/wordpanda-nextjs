import { User } from "@prisma/client";

export const REPORT_MAIL = (user: User, _: any) => {
    return {
    subject: `Novo usuário no wordpanda: ${user.firstName} ${user.lastName}!!!`,
    from: 'panda@wordpanda.app',
    attachments: [{
        filename: 'panda.gif',
        path: 'https://media.tenor.com/xaJrTrfiRcEAAAAM/happy-panda-bamboo.gif',
        cid: 'panda'
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
            .logo {
                text-align: center;
                margin-bottom: 20px;
            }
            .logo img {
                max-width: 200px;
                height: auto;
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
                    <img src="cid:panda" alt="Logo">
                </div>
                <h1>Novo usuário no wordpanda: ${user.firstName} ${user.lastName}!!!</h1>
            </div>
            <div class="content">
                <p>
                    O usuário ${user.firstName} ${user.lastName} acabou de se cadastrar no wordpanda.
                    email: ${user.email}
                    telefone: ${user.phone}
                    hour: ${new Date().toLocaleTimeString()}
                </p>
            </div>
            <div class="footer">
                <p>© 2021 wordpanda</p>
            </div>
        </div>
    </body>
    </html>
    `,

}}