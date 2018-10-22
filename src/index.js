'use strict'

const throwError = function (error) {
  return {
    error,
    object: {},
    string: ''
  }
}

const isNil = function (value) {
  return value === undefined || value === null
}

// Check that user-entered parameters match our expectations
const evaluateParameters = function (parameters, expectedParameters, ignoreEmpty = false) {
  const mapped = {}
  const mappedStrings = []

  if (isNil(parameters)) {
    return throwError('Parameters should be presented!')
  }

  for (const parameter of expectedParameters) {
    const { error, paramValue } = validate(parameter, parameters[parameter.name])
    if (error) {
      // only care about error
      return throwError(error)
    }
    if (!paramValue && ignoreEmpty) continue
    mapped[parameter.mappedName] = paramValue
    mappedStrings.push(`${parameter.mappedName}=${paramValue}`)
  }

  return {
    error: '',
    object: mapped,
    string: mappedStrings.join('&')
  }
}

// Note that if value == null is equivalent to
// Validate if the param value matches with expected params
const validate = function (parameter, paramValue) {
  if (isNil(paramValue)) {
    return validateEmptyParams(parameter, String(paramValue))
  }

  if (parameter.validator) {
    const error = validateParams(parameter, String(paramValue))
    return { error, paramValue }
  }

  return { error: '', paramValue }
}

// Returns error if the value is required or defaul value if any
const validateEmptyParams = function (parameter, paramValue) {
  let error = ''

  //Only set error when value is empty and no default value
  if (parameter.required && isNil(parameter.default)) {
    error = 'Required parameter ' + parameter.name + ' not provided'
  }

  const defaultParamValue = typeof parameter.default !== 'undefined' ? parameter.default : ''

  return { error, paramValue: defaultParamValue }
}

// Validate param value using given validator
const validateParams = function (parameter, paramValue) {
  let error = ''

  if (!parameter.validator(paramValue, parameter.options)) {
    error = 'Parameter ' + parameter.name + ' failed validation. Expected validator: ' + parameter.validator.name
  }

  if (error && parameter.options) {
    error += ' with options: ' + JSON.stringify(parameter.options)
  }

  return error
}

module.exports = {
  evaluateParameters,
  // export for unit testing
  validate,
  validateParams,
  validateEmptyParams
}
