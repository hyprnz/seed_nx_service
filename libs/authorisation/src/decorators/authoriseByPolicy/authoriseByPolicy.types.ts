import { PolicyExecutor } from '../../policy';

interface UserProfile {
    subject: string;
    activities: string[];
}
interface AuthoriseByPolicyOptions {
    /**
     * engine that will perform authorisation. You can build one using PolicyBuilder
     */
    policy: PolicyExecutor;
    actions?: string[];
    skip?: string[];
}

export type { UserProfile, AuthoriseByPolicyOptions };
