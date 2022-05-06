import nodemailer from 'nodemailer';
import { MailAdapter, SendMailData } from "../MailAdapter";


const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "149ce0993406f9",
        pass: "b904b5b5f1b1cc"
    }
});

export class NodemailerMailAdapter implements MailAdapter {
    async sendEmail ({ subject, body }: SendMailData) {
        await transport.sendMail({
            from: 'Equipe Feedget <oi@feedget.com>',
            to: 'Pablo Alan <pabloxt14@gmail.com>',
            subject,
            html: body,
        })
    }
}