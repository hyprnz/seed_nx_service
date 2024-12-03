// Proxy interceptors - https://2ality.com/2015/10/intercepting-method-calls.html
import 'reflect-metadata';
import { decorateWithPolicyAuthorisation } from './AuthoriseByPolicy';
import { authoriseByPolicyMetadataKey } from './authoriseByPolicy.util';

const handler = {
    get(target: any, propertyKey: any, receiver: any) {
        if (target[propertyKey]) {
            if (Reflect.getMetadataKeys(target, propertyKey).find((x) => x === authoriseByPolicyMetadataKey)) {
                return decorateWithPolicyAuthorisation(target[propertyKey], target, propertyKey, receiver);
            }
            return Reflect.get(target, propertyKey, receiver);
        }
    }
};
export const AuthorisableByResource = (domainType: string) => {
    return function (target: { new (...a: any): any }) {
        const original = target;
        const f: any = function (...args: any[]) {
            const instance: any = new original(...args);
            instance.domainType = domainType;
            return new Proxy(instance, handler);
        };
        f.prototype = original.prototype; // copy prototype so intanceof operator still works
        return f;
    };
};
