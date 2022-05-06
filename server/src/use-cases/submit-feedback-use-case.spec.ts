// test('sum 2 + 2', () => {
//     expect(2 + 2).toBe(4);
// });

import { SubmitFeedbackUseCase } from "./SubmitFeedbackUseCase";

describe('Submit feedback', () => {
    it('should be able to submit a feedback', async () => {
        const submitFeedback = new SubmitFeedbackUseCase(
            {create: async () => {}},
            {sendEmail: async () => {}}
        )

        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
            screenshot: 'test.jpg'
        })).resolves.not.toThrow();// esperar que a função não retorne um erro
    });
});