import { UserProfile } from '../authoriseByPolicy.types';

export class RequestBuilder {
    private request: { user: UserProfile };

    private constructor() {
        // Defaults
        this.request = {
            user: {
                subject: '',
                activities: []
            }
        };
    }

    static make(): RequestBuilder {
        return new RequestBuilder();
    }

    withSubject(identityAssertion: string) {
        this.request.user.subject = identityAssertion;
        return this;
    }

    withActivities(activities: string[]): this {
        this.request.user.activities = activities;
        return this;
    }

    build(): { user: UserProfile } {
        return this.request;
    }
}
