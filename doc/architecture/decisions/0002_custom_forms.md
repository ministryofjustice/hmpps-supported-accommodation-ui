# Custom forms

Date: 2023-09-05

## Status

Accepted

## Context

We are using the ["Task List System"](doc/task_list_system.md) to generate most
of our form pages. This system allows us to create 'pages' that use a shared
form an pattern of paths to PUT their data to:

**1. Regular 'page' submission to the pages controller**

```ts
paths.applications.pages.update({
  id: applicationId, 
  task: task, 
  page: pageName
})
```

e.g.

`PUT /applications/{applicationId}/tasks/confirm-eligibility/pages/confirm-eligibility`

In this case the task and page information is in the path.

**2. Special cases of submission direct to the applications controller**

We have come across a few instances where we need to transform or populate data
in a different way than the regular form pages. E.g. The `oasys-import` page in
Risk to Self needs to add data under the keys of other pages. In these cases we
are not using the shared `form` component from
`server/views/applications/pages/layout.njk` but instead rolling a new form that
posts directly to a path on the applications controller. 

```ts
paths.applications.update({ 
  id: applicationId 
})
```

e.g. 

`PUT /applications/{applicationId}`

In this case the task and page data is supplied in hidden form fields.

## Decision

We will submit form data direct to the application controller in more complex
scenarios e.g.

- when we are importing data in bulk, behind the scenes, from upstream services like OASys
- when we need to build up an arbitrarily long list of items, as in this case
  where the applicant can add one ACCT record after the other.

Where relevant we will put these forms in their own folder with the relevant task folder, e.g. a `risk-to-self/custom-form`
folder to make it as clear as possible that they behave differently than regular
pages.