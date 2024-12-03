import { describe } from 'vitest';
import { getEventSchema, postEventSchema } from './event.validation';
import { ZodError } from 'zod';

describe('Event validation test suite', () => {
    describe('Get Event Validation', () => {
        const validEventId = 'a71e6634-4f63-4eb0-941b-9dda7758ecfc';

        it('Should validate valid eventId', () => {
            // Assert
            expect(() => getEventSchema.parse({ params: { id: validEventId } })).not.toThrow(ZodError);
        });

        it('Should validate invalid eventId', () => {
            // Assert
            expect(() => getEventSchema.parse({ params: { id: 'not an id' } })).toThrow(ZodError);
        });
    });

    describe('Post Event Validation', () => {
        const unsavedEvent = {
            subject: 'testUser01',
            subjectName: 'Test',
            name: 'Testing',
            description: 'doing some testing'
        };

        it('Should validate valid event', () => {
            // Assert
            expect(() => postEventSchema.parse({ body: unsavedEvent })).not.toThrow(ZodError);
        });

        it('Should validate invalid event no id', () => {
            // Assert
            expect(() => postEventSchema.parse({ body: { ...unsavedEvent, id: 'thereShouldNotBeOne' } })).toThrow(ZodError);
        });

        it('Should validate invalid event no data', () => {
            // Assert
            expect(() => postEventSchema.parse({ body: {} })).toThrow(ZodError);
        });
    });
});
