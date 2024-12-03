import { isNil, not } from 'ramda';

const returnUndefinedForSearchIdsWithNoResult = <Entity extends { id: string }>(
    searchIds: (string | undefined | null)[],
    resultEntities: Entity[]
): (Entity | undefined)[] =>
    searchIds.reduce((acc: (Entity | undefined)[], entityId: any): (Entity | undefined)[] => {
        const resultEntity: Entity | undefined = resultEntities.find((entity: Entity) => entity.id === entityId);
        if (not(isNil(resultEntity))) {
            acc.push(resultEntity);
        } else {
            acc.push(undefined);
        }
        return acc;
    }, []);

export { returnUndefinedForSearchIdsWithNoResult };
