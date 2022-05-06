// test('sum 2 + 2', () => {
//     expect(2 + 2).toBe(4);
// });

/* SPIES (ESPIÕES): 
- Maneiras de sabermos dentro dos testes do jest se uma função foi chamada ou não
*/

const createFeedbackSpy = jest.fn();//função spie
const sendMailSpy = jest.fn();

import { SubmitFeedbackUseCase } from "./SubmitFeedbackUseCase";

const submitFeedback = new SubmitFeedbackUseCase(
    { create: createFeedbackSpy },
    { sendEmail: sendMailSpy }
)

describe('Submit feedback', () => {
    it('should be able to submit a feedback', async () => {

        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
            screenshot: 'data:image/png;base64,sjbjasbfjsbfjsj'
        })).resolves.not.toThrow();// esperar que a função não retorne um erro


        // testando se funções espiãs foram chamadas
        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    });

    it('should not be able to submit a feedback without a type', async () => {

        await expect(submitFeedback.execute({
            type: '',
            comment: 'example comment',
            screenshot: 'data:image/png;base64,sjbjasbfjsbfjsj'
        })).rejects.toThrow();// esperar que a função não rode e que de retorne um erro
    });

    it('should not be able to submit a feedback without a comment', async () => {

        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: '',
            screenshot: 'data:image/png;base64,sjbjasbfjsbfjsj'
        })).rejects.toThrow();// esperar que a função não rode e que de retorne um erro
    });

    it('should not be able to submit a feedback with an invalid screenshot', async () => {

        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
            screenshot: 'test.jpg'
        })).rejects.toThrow();// esperar que a função não rode e que de retorne um erro
    });
});