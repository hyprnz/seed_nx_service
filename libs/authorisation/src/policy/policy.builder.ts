import { PolicyDecisionPoint, PolicyEnforcementPoint, PolicyExecutor, PolicyInformationPoint } from './policy.types';
import { composePolicyEnforcer } from './policy.tools';

class PolicyBuilder {
    private informationPoints: PolicyInformationPoint[] = [];
    private decisionPoints: PolicyDecisionPoint[] = [];
    private enforcementPoints: PolicyEnforcementPoint[] = [];

    private constructor() {}

    public static make() {
        return new PolicyBuilder();
    }

    public addInformationPoint(informationPoint: PolicyInformationPoint) {
        this.informationPoints.push(informationPoint);
        return this;
    }

    public addDecisionPoint(decisionPoint: PolicyDecisionPoint) {
        this.decisionPoints.push(decisionPoint);
        return this;
    }

    public addEnforcementPoint(enforcementPoint: PolicyEnforcementPoint) {
        this.enforcementPoints.push(enforcementPoint);
        return this;
    }

    public build(): PolicyExecutor {
        return composePolicyEnforcer(...this.informationPoints, ...this.decisionPoints, ...this.enforcementPoints);
    }
}

export { PolicyBuilder };
