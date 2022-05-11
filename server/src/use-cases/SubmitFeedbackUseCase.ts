import { MailAdapter } from "../adapters/MailAdapter";
import { FeedbacksRepository } from "../repositories/FeedbacksRepository";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {

    constructor(
        private feedbacksRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter
    ) { }

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        if (!type) {
            throw new Error('Type is required.');
        }

        if (!comment) {
            throw new Error('Comment is required.');
        }

        if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
            throw new Error('Invalid screenshot format');
        }


        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot
        })

        await this.mailAdapter.sendEmail({
            subject: 'Novo feedback',
            body: [
                `<div style="font-family: 'Roboto', sans-serif; color: #121214;">`,
                '<h2 style="text-align: center; color: #8257E6; text-transform: capitalize;">',
                'Email de Feedback',
                '</h2>',
                '<p style="box-shadow: 0px 0px 0px 2px #8257E6; border-radius: 5px; padding: 1rem;">',
                '<strong>Tipo do feedback:</strong>',
                `<span>${type}</span>`,
                '</p>',
                `<p style="box-shadow: 0px 0px 0px 2px #8257E6; border-radius: 5px; padding: 1rem;">`,
                `<strong>Comentário:</strong>`,
                `<span>${comment}</span>`,
                `</p>`,
                `<div style="box-shadow: 0px 0px 0px 2px #8257E6; border-radius: 5px; padding: 1rem;">`,
                `<strong style="display: block; text-align: center; margin-bottom: 1rem;">`,
                `Screenshot`,
                `</strong>`,
                screenshot ?
                    `<img src="${screenshot}" width="100%" />` :
                    '<p style="width: 100%; color: #8257E6; border: 2px dashed #8257E6; border-radius: 5px; text-align: center; line-height: 270px;">Sem Screenshot</p>',
                `</div>`,
                `</div>`
            ].join('\n')
        })

    }
}