interface MakeIsOwnerDecisionOptions {
    owningActivity?: string;
    getOwnersForObjectId?: (objectId: string) => Promise<string[]>;
}

export { MakeIsOwnerDecisionOptions };
