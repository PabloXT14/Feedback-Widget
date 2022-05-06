import express from 'express';
import { NodemailerMailAdapter } from './adapters/nodemailer/NodemailerMailAdapter';
import { PrismaFeedbacksRepository } from './repositories/prisma/PrismaFeedbacksRepository';
import { SubmitFeedbackUseCase } from './use-cases/SubmitFeedbackUseCase';

export const routes = express.Router();

routes.post("/feedbacks", async (request, response) => {
    const { type, comment, screenshot } = request.body;

    const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
    const nodemailerMailAdapter = new NodemailerMailAdapter();

    const submitFeedbackUseCase = new SubmitFeedbackUseCase(prismaFeedbacksRepository, nodemailerMailAdapter);

    await submitFeedbackUseCase.execute({
        type,
        comment,
        screenshot
    });


    return response.status(201).send();
})