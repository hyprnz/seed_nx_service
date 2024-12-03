interface ObjectMeta {
    id?: string;
    type?: string;
    owners?: string[];
    data?: any;
}

interface Config {
    disabled?: boolean;
}

interface PolicyInformation {
    config?: Config;
    subject: {
        identityAssertions?: string[]; // Identities of the user
        activities?: string[]; // Activities the user has
    };
    object?: ObjectMeta; // Thing you want access to
    actions: string[]; // Activity or action (verb or predicate) thing you are trying to do
    decisionPointResults?: {
        [decision: string]: boolean;
    };
    enforcementPointResults?: {
        [enforcement: string]: any;
    };
}

type PolicyInformationPoint = (pip: PolicyInformation) => Promise<PolicyInformation>;
type PolicyDecisionPoint = (pip: PolicyInformation) => Promise<PolicyInformation>;
type PolicyEnforcementPoint = (pip: PolicyInformation) => Promise<PolicyInformation>;
type PolicyComponentPoint = PolicyInformationPoint | PolicyDecisionPoint | PolicyEnforcementPoint;
type PolicyExecutor = (pip: PolicyInformation) => Promise<any>;

export type { PolicyComponentPoint, PolicyInformation, PolicyInformationPoint, PolicyDecisionPoint, PolicyEnforcementPoint, PolicyExecutor };
