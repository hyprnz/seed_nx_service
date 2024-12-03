import { describe, expect, it } from 'vitest';
import { returnUndefinedForSearchIdsWithNoResult } from './util.getByIds';
import { EventEntity } from '../index';
import { EventEntityBuilder } from '../dao/event/testFixtures/EventEntityBuilder';

describe('waitTimeEntity Dao util test suite', () => {
    it('mergeWaitTimeEntityIdsWithResult should match waitTimeEntity ids with their resultant waitTimeEntitys ', () => {
        // Setup
        const entity1: EventEntity = EventEntityBuilder.makeWithId().build();
        const waitTimeEntityIds: (string | undefined | null)[] = [entity1.id, null, undefined];
        const waitTimeEntities: EventEntity[] = [entity1];

        // Test
        const result: (EventEntity | undefined)[] = returnUndefinedForSearchIdsWithNoResult(waitTimeEntityIds, waitTimeEntities);

        // Verify
        expect(result[0]).toEqual(entity1);
        expect(result[1]).toBeUndefined();
        expect(result[2]).toBeUndefined();
    });
});
