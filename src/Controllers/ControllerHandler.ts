import { Request, Response } from 'express';
export const controllerHandler =
    (promise: (request: Request) => Promise<any>) =>
        async (request: Request, response: Response) => {
            try {
                const result = await promise(request);
                return response.status(200).json(result);
            } catch (error) {
                return response.status(400).json({ error_code: error });
            }
        };