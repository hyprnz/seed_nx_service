import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../contexts/customWorld';
import { expect } from 'chai';

Given(/I create an event with (.*) and (.*)/, async function (this: CustomWorld, name: string, description: string) {
    await this.eventAPIRequest.createEvent({
        subject: 'test',
        subjectName: 'test',
        name,
        description
    });
});

When('I get that event', async function (this: CustomWorld) {
    await this.eventAPIRequest.getEvent(this.eventAPIRequest.createEventResponse.id);
});

Then(/It still has (.*) and (.*)/, async function (this: CustomWorld, name: string, description: string) {
    const event = this.eventAPIRequest.getEventResponse;
    console.log('###################### event ', event);
    expect(event.name).to.equal(name);
    expect(event.description).to.equal(description);
});
