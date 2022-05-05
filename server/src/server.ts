import express from 'express';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const app = express();

app.use(express.json());


const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "149ce0993406f9",
      pass: "b904b5b5f1b1cc"
    }
  });


app.post("/feedbacks", async (request, response) => {
    const { type, comment, screenshot } = request.body;

    const feedback = await prisma.feedback.create({
        data: {
            type,
            comment,
            screenshot
        }
    })

    await transport.sendMail({
        from: 'Equipe Feedget <oi@feedget.com>',
        to: 'Pablo Alan <pabloxt14@gmail.com>',
        subject: 'Novo feedback',
        html: [
            '<div style="font-family: sans-serif; font-size: 16px; color: #111;">',
            `<p>Tipo do feedback: ${type}</p>`,
            `<p>Comentário: ${comment}</p>`,
            '</div>'
        ].join('\n')
    })

    return response.status(201).json({data: feedback});
})

app.listen(3333, () => console.log("Server running on port 3333"))