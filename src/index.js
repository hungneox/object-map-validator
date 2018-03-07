'use strict'

// Check that user-entered parameters match our expectations
const evaluateParameters = function (parameters, expectedParameters, ignoreEmpty=false) {
  let mapped = {}
  let mappedStrings = []

  if (parameters == null) {
    return {
      error: "Parameters cannot be null!",
      object: {},
      string: ''
    }
  }

  for (let parameter of expectedParameters) {
    var [error, paramValue] = validate(parameter, parameters[parameter.name])
    if (error) break
    if (!paramValue && ignoreEmpty) continue
    mapped[parameter.mappedName] = paramValue
    mappedStrings.push(`${parameter.mappedName}=${paramValue}`)
  }

  return {
    error: error,
    object: mapped,
    string: mappedStrings.join('&')
  }
}

//Note that if value == null is equivalent to 
// Validate if the param value matches with expected params
const validate = function (parameter, paramValue) {
  let error = ''
  if (paramValue == null) {
    [error, paramValue] = validateEmptyParams(parameter, String(paramValue))
  } else if (parameter.validator) {
    error = validateParams(parameter, String(paramValue))
  }
  return [error, paramValue]
}

// Returns error if the value is required or defaul value if any
const validateEmptyParams = function (parameter, paramValue) {
  let error = ''

  //Only set error when value is empty and no default value
  if (parameter.required && parameter.default == null) {
    error = 'Required parameter ' + parameter.name + ' not provided'
  }

  paramValue = typeof parameter.default !== 'undefined' ? parameter.default : ''

  return [error, paramValue]
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
