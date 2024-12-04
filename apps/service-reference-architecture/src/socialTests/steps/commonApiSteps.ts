import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../contexts/customWorld';
import { expect } from 'chai';

Then('the response status should be {int}', function (this: CustomWorld, responseStatus: number) {
    expect(this.apiResponseStatus).to.equal(responseStatus);
});
