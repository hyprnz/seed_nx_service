import { After, Before, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { CustomWorld } from '../contexts/customWorld.ts';

setWorldConstructor(CustomWorld);
setDefaultTimeout(process.env.E2E_TIMEOUT ? Number(process.env.E2E_TIMEOUT) : 10000);

Before(async function (this: CustomWorld) {
    // Before Hooks
});

After(async function (this: CustomWorld) {
    // After Hooks
});
