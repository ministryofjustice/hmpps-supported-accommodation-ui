import type { Request, Response } from 'express'
import jsonpath from 'jsonpath'

import type { ErrorMessage, ErrorMessages, ErrorSummary, ErrorsAndUserInput } from '@approved-premises/ui'
import { SanitisedError } from '../sanitisedError'
import errorLookup from '../i18n/en/errors.json'
import { TaskListAPIError, ValidationError } from './errors'

interface InvalidParams {
  propertyName: string
  errorType: string
}

const firstFlashItem = (request: Request, key: string) => {
  const message = request.flash(key)
  return message ? message[0] : undefined
}

export const fetchErrorsAndUserInput = (request: Request): ErrorsAndUserInput => {
  const errors = firstFlashItem(request, 'errors') || {}
  const errorSummary = request.flash('errorSummary') || []
  const userInput = firstFlashItem(request, 'userInput') || {}
  const errorTitle = firstFlashItem(request, 'errorTitle')

  return { errors, errorTitle, errorSummary, userInput }
}

export const catchAPIErrorOrPropogate = (request: Request, response: Response, error: SanitisedError | Error): void => {
  if (error instanceof TaskListAPIError) {
    request.flash('errors', {
      crn: errorMessage(error.field, error.message),
    })
    request.flash('errorSummary', [errorSummary(error.field, error.message)])

    response.redirect(request.headers.referer)
  } else {
    throw error
  }
}

export const catchValidationErrorOrPropogate = (
  request: Request,
  response: Response,
  error: SanitisedError | Error,
  redirectPath: string,
): void => {
  const errors = extractValidationErrors(error)

  const errorMessages = generateErrorMessages(errors)
  const errorSummary = generateErrorSummary(errors)

  request.flash('errors', errorMessages)
  request.flash('errorSummary', errorSummary)
  request.flash('userInput', request.body)

  response.redirect(redirectPath)
}

export const errorMessage = (field: string, text: string): ErrorMessage => {
  return {
    text,
    attributes: {
      [`data-cy-error-${field}`]: true,
    },
  }
}

export const errorSummary = (field: string, text: string): ErrorSummary => {
  return {
    text,
    href: `#${field}`,
  }
}

export const generateErrorMessages = (errors: Record<string, string>): ErrorMessages => {
  return Object.keys(errors).reduce((obj, key) => {
    return {
      ...obj,
      [key]: errorMessage(key, errors[key]),
    }
  }, {})
}
const errorText = (error: InvalidParams): ErrorSummary => {
  const errors =
    jsonpath.value(errorLookup, error.propertyName) ||
    throwUndefinedError(`Cannot find a translation for an error at the path ${error.propertyName}`)

  const text =
    errors[error.errorType] ||
    throwUndefinedError(
      `Cannot find a translation for an error at the path ${error.propertyName} with the type ${error.errorType}`,
    )

  return text
}

const throwUndefinedError = (message: string) => {
  throw new Error(message)
}

const extractValidationErrors = (error: SanitisedError | Error) => {
  if ('data' in error) {
    if (error.data['invalid-params']) {
      return generateErrors(error.data['invalid-params'])
    }
    if (error instanceof ValidationError) {
      return error.data as Record<string, string>
    }
  }

  throw error
}

const generateErrors = (params: Array<InvalidParams>): Record<string, string> => {
  return params.reduce((obj, error) => {
    const key = error.propertyName.split('.').slice(1).join('_')
    return {
      ...obj,
      [key]: errorText(error),
    }
  }, {})
}

export const generateErrorSummary = (errors: Record<string, string>): Array<ErrorSummary> => {
  return Object.keys(errors).map(k => errorSummary(k, errors[k]))
}
