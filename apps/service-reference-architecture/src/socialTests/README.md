# E2E Tests

## Intent (value perspective)

Simulate a user end to end flow to complete a single piece of business value
provided by this application.

## Constraints

High level business case tests only

## When to run

Run after a package has been created and deployed. Recommend deploying to
an ephemeral environment like docker-compose

## Running locally

Start up all required apps locally using `pnpm nx e2e:serve travel-api`.

You can then run the tests using `pnpm nx test:social:e2e travel-api`.

## Generating Client

When there are changes to the contract, you can regenerate the client code using `pnpm nx test:social:e2e:gen-client travel-api`.

## MainEnv

The tests default to running against local config currently.
