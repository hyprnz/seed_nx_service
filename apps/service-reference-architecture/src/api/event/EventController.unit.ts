import { describe, expect, it, vi } from 'vitest';
import { EventController } from './EventController';
import { EventEntity } from '../../database';

describe('Probes controller test suite', () => {
    const mockResponse: any = {
        json: vi.fn()
    };
    const mockDaoGetEvent = vi.fn();
    const mockDaoSaveEvent = vi.fn();
    const mockGetEventDao: any = () => ({
        get: (eventId: string) => Promise.resolve(mockDaoGetEvent(eventId)),
        save: (event: EventEntity) => Promise.resolve(mockDaoSaveEvent(event))
    });

    const mockValidUnsavedEvent = {
        subject: 'testUser01',
        subjectName: 'Test',
        name: 'Testing',
        description: 'doing some testing'
    };

    const mockValidSavedEvent = {
        ...mockValidUnsavedEvent,
        id: 'e0092e37-9485-40dc-be9b-0a25c663f4a4',
        createdAt: '2024-11-19T21:06:20.416Z'
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should get event', async () => {
        // Assemble
        const eventController = new EventController(mockGetEventDao);

        // Expectations
        mockDaoGetEvent.mockReturnValue(mockValidSavedEvent);

        // Act
        await eventController.get({ params: { id: mockValidSavedEvent.id } } as any, mockResponse);

        // Assert
        expect(mockDaoGetEvent).toBeCalledWith(mockValidSavedEvent.id);
    });

    it('should create event', async () => {
        // Assemble
        const eventController = new EventController(mockGetEventDao);

        // Expectations
        mockDaoSaveEvent.mockReturnValue(mockValidSavedEvent);

        // Act
        await eventController.post(
            {
                headers: { user: { subject: 'pants', activities: ['*:resource:event:create'] } },
                body: mockValidUnsavedEvent
            } as any,
            mockResponse
        );

        // Assert
        expect(mockDaoSaveEvent).toBeCalledWith(mockValidUnsavedEvent);
    });
});
