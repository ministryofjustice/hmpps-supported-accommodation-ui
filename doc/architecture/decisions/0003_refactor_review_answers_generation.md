# Refactor 'review answers' functionality inherited from CAS1/CAS3

Date: 2023-10-06

## Status

Proposed

## Context

The 'check your answers' and other review pages in CAS1 and CAS3 are generated using a complicated series of functions and callbacks, located in a number of different util files. Some of this functionality is duplicated in the integration tests for those projects. The complexity of the code makes it difficult to understand and difficult to debug.

As it stands, both projects loop through all sections (except any `Check your answers` section) and generate an object for each, then looping through the section's tasks and generating a tile for each task, the rows of which are populated by looping through the task's pages, and for each key/value pair in the page's `response()` method, adding a `SummaryListItem` (or, in the case of an array, an array of items). This system centres around the page's `response()` method, which is responsible for translating questions and answers from keys to user readable values.

## Decision

We will refactor the functions that generate the check your answers page, to make them more readable and hopefully easier to follow.

We will also create a `getQuestions` function that will generate the questions and answers (where answers are predefined, e.g. yes/no) for all form pages, and store text values by key for all questions and answers (where predefined). This will in most cases render the Page's `response()` method redundant. We will instead loop through the tasks, pages and questions in the Application's `data` key, and for each question, return the question and answer text (if predefined) from the `getQuestions` function. If the answer text is not predefined (e.g. in the case of a free text input), we will return it from the Application data.

In complex cases we may continue to use a `response()` method on the Page.

## Consequences

This change will create a single source of truth for form page questions and answers. This should allow for less repetition within the code and tests.
