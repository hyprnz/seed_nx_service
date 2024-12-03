# SDK for the Jwt API

## Overview

Leverages the following packages to provide a simple interface for working with JWTs in one place

-   jsonwebtoken - verification
-   jwks-rsa - JWKS keystores and endpoints
-   node-jose - JWT encryption decryption

## Operations supported

| operation                                         | description                                                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| verifyJWT                                         | based on what options you pass you can verify a token based on signature, expiry, issuer and audience       |
| encryptJwt                                        | encrypt a signed JWT resulting in a JWE                                                                     |
| decryptJWT                                        | decrypt a JWE                                                                                               |
| encryptJWTFromJwksKey                             | same as encyrptJWT but using a JWKS (json webtoken keystore to get key)                                     |
| makeGetPublicSignKeyFromJWKSURL                   | has the following default config {jwksUri: jwksUrl, cache: true, rateLimit: true, jwksRequestsPerMinute: 1} |
| makeGetPublicEncryptionKeyFromJWKSURL             |                                                                                                             |
| generateEncryptedTokenViaClientCredentialsRequest |                                                                                                             |

## VerifyOptions

For when checking a JWT with verifyJWT

-   algorithms?: Algorithm[];
-   audience?: string | RegExp | Array<string | RegExp>;
-   issuer?: string | string[];
-   ignoreExpiration?: boolean;

## Example Usage

```js
import { makeGetPublicSignKeyFromJWKSURL, verifyJWT } from '@hyprnz/jwt'

const getPublicSignKeyFromJWKSURL = makeGetPublicSignKeyFromJWKSURL(
    environment.profileRegistration.authorize.verify.jwksUrl,
)

const verifyOptions: VerifyOptions = {
  ignoreExpiration: false,
  algorithms: ['RS256'],
  issuer: ['https://auth.uat.io/'] // for Prod use ['https://auth.jarden.io/','https://auth.jarden.io/']
)
const tokenPayload = await verifyJWT(tokenResponse.id_token, {}, getPublicSignKeyFromJWKSURL)

```
