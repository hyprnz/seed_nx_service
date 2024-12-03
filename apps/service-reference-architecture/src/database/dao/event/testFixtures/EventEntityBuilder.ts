import { EventEntity } from '../event.dao.entity.ts';
import { faker } from '@faker-js/faker';

export class EventEntityBuilder {
    private event: EventEntity;

    private constructor() {
        this.event = {
            id: faker.string.uuid()
        } as EventEntity;
    }

    static make(): EventEntityBuilder {
        return new EventEntityBuilder();
    }

    static makeWithId(): EventEntityBuilder {
        return new EventEntityBuilder().withId(faker.string.uuid());
    }

    withId(id: string): this {
        this.event.id = id;
        return this;
    }

    withName(key: string): this {
        this.event.name = key;
        return this;
    }

    withDescription(value: string): this {
        this.event.description = value;
        return this;
    }

    build(): EventEntity {
        return this.event;
    }
}
