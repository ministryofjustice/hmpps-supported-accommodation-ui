# 2. Use Playwright for end-to-end tests

Date: 2023-06-09

## Status

Accepted

## Context

We have a suite of integration tests in this repository that use
[Cypress](https://www.cypress.io/) to test the application locally against a
mock API. We'd like to be able to test the application as a whole with a real
backend to ensure everything is working as expected on a deployed environment.

In [our first ADR](./0001_reuse_existing_cas_projects.md) we have said we will stick as close as possible to the other CAS teams where feasible and pragmatic. CAS1 and 2 currently diverge in their implementation of e2e's. 

CAS2 are currently [using Cypress tests within the same repo as their UI](https://github.com/ministryofjustice/hmpps-temporary-accommodation-ui/tree/main/e2e).

CAS1 initially trialled running Cypress against a deployed environment but [have moved away from this due to slowness, flakiness and conflicting Typescript settings between their main codebase and the code used to write the E2E tests](https://github.com/ministryofjustice/hmpps-approved-premises-ui/blob/0801a863426e0ed0237c28d14c71d498f1395122/doc/architecture/decisions/0010-use-playwright-for-end-to-end-tests.md).

## Decision

As the Approved Premises team [have
done](https://github.com/ministryofjustice/hmpps-approved-premises-ui/blob/main/doc/architecture/decisions/0010-use-playwright-for-end-to-end-tests.md),
we're going to trial using a suite of E2E tests in a different repo using
[Playwright](https://playwright.dev/). This is a more lightweight alternative
to Cypress, which is in use in other parts of HMPPS (See
<https://github.com/ministryofjustice/hmpps-probation-integration-e2e-tests>).

These tests will be run in the `end_to_end_test` CircleCI pipeline on the
development environment, after the environment has deployed, both on the UI and
API codebases.

We will deliberately keep the tests focused, as more of a smoke test to ensure
the application runs as expected, rather than reusing integration test code
which is more robust and has a lot of expectations.

We will keep an eye on these tests and how they go, because there is a balance
between us having a consistently passing test suite (which may suggest our
happy path is too "happy") and a test suite that breaks a lot, but for
legitimate reasons (i.e. a change in the UI or API that breaks functionality).

## Consequences

This will mean we're maintaining two test suites, one for integration and one
for E2E tests, however:

- The E2E tests will be kept deliberately simplistic, only testing the "happy
  path", with minimal expectations
- We will be able to use the VSCode [Playwright Test
  extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright),
  which will allow us to "record" any new/changed tests - meaning we can
  rapidly generate / iterate E2E tests
