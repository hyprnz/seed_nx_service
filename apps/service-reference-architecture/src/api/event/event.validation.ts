import * as z from 'zod';

const getEventSchema: z.Schema = z.object({
    params: z
        .object({
            id: z.string().uuid()
        })
        .required({ id: true })
});

const postEventSchema: z.Schema = z.object({
    body: z
        .object({
            id: z.string().length(0).optional(),
            subject: z.string(),
            subjectName: z.string(),
            name: z.string(),
            description: z.string()
        })
        .required({
            subject: true,
            subjectName: true,
            name: true,
            description: true
        })
});

export { getEventSchema, postEventSchema };
