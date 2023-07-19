import { Request, Response } from 'express'
import { createMock } from '@golevelup/ts-jest'
import type { ErrorMessages, ErrorSummary } from '@approved-premises/ui'
import { SanitisedError } from 'server/sanitisedError'
import TaskListPage from 'server/form-pages/taskListPage'
import {
  catchAPIErrorOrPropogate,
  catchValidationErrorOrPropogate,
  fetchErrorsAndUserInput,
  firstFlashItem,
} from './validation'
import { TaskListAPIError, ValidationError } from './errors'
import errorLookups from '../i18n/en/errors.json'

jest.mock('../i18n/en/errors.json', () => {
  return {
    fundingSource: {
      empty: 'You must choose a funding source',
    },
  }
})

describe('catchValidationErrorOrPropogate', () => {
  const request = createMock<Request>({})
  const response = createMock<Response>()

  const expectedErrors = {
    fundingSource: { text: errorLookups.fundingSource.empty, attributes: { 'data-cy-error-fundingSource': true } },
  }

  const expectedErrorSummary = [{ text: errorLookups.fundingSource.empty, href: '#fundingSource' }]

  beforeEach(() => {
    request.body = {
      some: 'field',
    }
  })

  it('sets the errors and request body as flash messages and redirects back to the form', () => {
    const error = createMock<SanitisedError>({
      data: {
        'invalid-params': [
          {
            propertyName: '$.fundingSource',
            errorType: 'empty',
          },
        ],
      },
    })

    catchValidationErrorOrPropogate(request, response, error, 'some/url')

    expect(request.flash).toHaveBeenCalledWith('errors', expectedErrors)
    expect(request.flash).toHaveBeenCalledWith('errorSummary', expectedErrorSummary)
    expect(request.flash).toHaveBeenCalledWith('userInput', request.body)

    expect(response.redirect).toHaveBeenCalledWith('some/url')
  })

  it('sets a generic error and redirects back to the form', () => {
    const error = createMock<SanitisedError>({
      data: {
        detail: 'Some generic error',
        'invalid-params': [],
      },
    })

    catchValidationErrorOrPropogate(request, response, error, 'some/url')

    expect(request.flash).toHaveBeenCalledWith('errorSummary', { text: 'Some generic error' })
    expect(request.flash).toHaveBeenCalledWith('userInput', request.body)

    expect(response.redirect).toHaveBeenCalledWith('some/url')
  })

  it('gets errors from a ValidationError type', () => {
    const error = new ValidationError<TaskListPage>({
      data: {
        crn: 'You must enter a valid crn',
        error: 'You must enter a valid arrival date',
      },
    })

    catchValidationErrorOrPropogate(request, response, error, 'some/url')

    expect(request.flash).toHaveBeenCalledWith('errors', expectedErrors)
    expect(request.flash).toHaveBeenCalledWith('errorSummary', expectedErrorSummary)
    expect(request.flash).toHaveBeenCalledWith('userInput', request.body)

    expect(response.redirect).toHaveBeenCalledWith('some/url')
  })

  it('throws the error if the error is not the type we expect', () => {
    const err = new Error('Some unhandled error')
    err.name = 'SomeUnhandledError'
    err.stack = 'STACK_GOES_HERE'

    const result = () => catchValidationErrorOrPropogate(request, response, err, 'some/url')

    expect(result).toThrowError(err)
    expect(result).toThrowError(
      expect.objectContaining({
        message: 'Some unhandled error',
        name: 'SomeUnhandledError',
        stack: 'STACK_GOES_HERE',
      }),
    )
  })

  it('throws an error if the property is not found in the error lookup', () => {
    const error = createMock<SanitisedError>({
      data: {
        'invalid-params': [
          {
            propertyName: '$.foo',
            errorType: 'bar',
          },
        ],
      },
    })

    expect(() => catchValidationErrorOrPropogate(request, response, error, 'some/url')).toThrowError(
      'Cannot find a translation for an error at the path $.foo',
    )
  })

  it('throws an error if the error type is not found in the error lookup', () => {
    const error = createMock<SanitisedError>({
      data: {
        'invalid-params': [
          {
            propertyName: '$.fundingSource',
            errorType: 'invalid',
          },
        ],
      },
    })

    expect(() => catchValidationErrorOrPropogate(request, response, error, 'some/url')).toThrowError(
      'Cannot find a translation for an error at the path $.fundingSource with the type invalid',
    )
  })
})

describe('catchAPIErrorOrPropogate', () => {
  const request = createMock<Request>({ headers: { referer: 'foo/bar' } })
  const response = createMock<Response>()

  it('populates the error and redirects to the previous page if the API finds an error', () => {
    const error = new TaskListAPIError('some message', 'field')

    catchAPIErrorOrPropogate(request, response, error)

    expect(request.flash).toHaveBeenCalledWith('errors', {
      crn: { text: error.message, attributes: { 'data-cy-error-field': true } },
    })
    expect(request.flash).toHaveBeenCalledWith('errorSummary', [
      {
        text: error.message,
        href: `#${error.field}`,
      },
    ])

    expect(response.redirect).toHaveBeenCalledWith(request.headers.referer)
  })

  it('throws the error if not of type TaskListAPIError', () => {
    const error = Error('some unhandled error')

    const result = () => catchAPIErrorOrPropogate(request, response, error)

    expect(result).toThrowError(error)
  })
})

describe('fetchErrorsAndUserInput', () => {
  const request = createMock<Request>({})

  let errors: ErrorMessages
  let userInput: Record<string, unknown>
  let errorSummary: ErrorSummary
  let errorTitle: string

  beforeEach(() => {
    ;(request.flash as jest.Mock).mockImplementation((message: string) => {
      return {
        errors: [errors],
        userInput: [userInput],
        errorSummary,
        errorTitle: [errorTitle],
      }[message]
    })
  })

  it('returns default values if there is nothing present', () => {
    const result = fetchErrorsAndUserInput(request)

    expect(result).toEqual({ errors: {}, errorSummary: [], userInput: {}, errorTitle: undefined })
  })

  it('fetches the values from the flash', () => {
    errors = createMock<ErrorMessages>()
    errorSummary = createMock<ErrorSummary>()
    userInput = { foo: 'bar' }
    errorTitle = 'Some title'

    const result = fetchErrorsAndUserInput(request)

    expect(result).toEqual({ errors, errorSummary, userInput, errorTitle })
  })
})

describe('firstFlashItem', () => {
  describe('when there is an item', () => {
    it('returns the first flash item', () => {
      const request = createMock<Request>({})
      const flashMessage = 'flash message'
      ;(request.flash as jest.Mock).mockImplementation(() => [flashMessage])

      const result = firstFlashItem(request, 'key')

      expect(result).toBe(flashMessage)
    })
  })

  describe('when there is nothing in the flash', () => {
    it('returns undefined', () => {
      const request = createMock<Request>({})
      ;(request.flash as jest.Mock).mockImplementation(() => null)

      const result = firstFlashItem(request, 'key')

      expect(result).toBe(undefined)
    })
  })
})
