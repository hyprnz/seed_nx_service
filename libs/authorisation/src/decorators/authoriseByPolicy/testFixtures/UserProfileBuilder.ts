import { UserProfile } from '../authoriseByPolicy.types.ts';

export class UserProfileBuilder {
    private userProfile: UserProfile;

    private constructor() {
        // Defaults
        this.userProfile = {
            subject: '',
            activities: []
        };
    }

    static make(): UserProfileBuilder {
        return new UserProfileBuilder();
    }

    withSubject(identityAssertion: string) {
        this.userProfile.subject = identityAssertion;
        return this;
    }

    withActivities(activities: string[]): this {
        this.userProfile.activities = activities;
        return this;
    }

    build(): UserProfile {
        return this.userProfile;
    }
}
