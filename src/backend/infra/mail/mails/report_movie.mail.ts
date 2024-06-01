import { User } from "@prisma/client";

export const REPORT_MOVIE_MAIL = (user: User, options: any) => {
    return {
        subject: `Pedido de inclusão de: ${user.firstName} ${user.lastName}!!!`,
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
                <h1>solicitação de: ${user.firstName} ${user.lastName}!!!</h1>
            </div>
            <div class="content">
                <p>
                    O usuário ${user.firstName} ${user.lastName} acabou de solicitar a inclusão de um filme.
                    email: ${user.email}
                    telefone: ${user.phone}
                    hour: ${new Date().toLocaleTimeString()}
                </p>
                <h2>Detalhes do filme:</h2>
                <pre>
                    ${JSON.stringify(options, null, 2)}
                </pre>
            </div>
            <div class="footer">
                <p>© 2021 wordpanda</p>
            </div>
        </div>
    </body>
    </html>
    `,

    }
}