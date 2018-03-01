# Object Map Validator

This object-map validator supports validating `event.body` against a list of expected parameters, and return default values for required fields if they are missing from the request. Under the hood it use [validator](https://www.npmjs.com/package/validator) module.

# Installation

```
npm install object-map-validator
```

# Usage

```javascript
let objectMapValidator = require('object-map-validator')
let validator = require('validator')

let resp = objectMapValidator.evaluateParameters(
    {
        'id': '100', 'username': 'johndoe'
    }, [{
        name: 'id',
        mappedName: 'customerNo',
        required: true,
        validator: validator.isInt
    },
    {
        name: 'username',
        mappedName: 'customerName',
        required: true,
        validator: validator.isAlpha,
    },
    {
        name: 'phone',
        mappedName: 'phoneNo',
        required: true,
        default: '0441122334'
    }
])

// resp = { 
//     error: '',
//     object: { 
//         customerNo: '100',
//         customerName: 'johndoe',
//         phoneNo: '0441122334' 
//     },
//     string: 'customerNo=100&customerName=johndoe&phoneNo=0441122334' 
// }
```

Validation with options

```javascript
let objectMapValidator = require('object-map-validator')
let validator = require('validator')

let resp = objectMapValidator.evaluateParameters(
    {
        'age': 17
    }, [{
        name: 'age',
        mappedName: 'iAge',
        required: true,
        validator: validator.isInt
        options: {min: 18}
    }
])

// resp = { 
//   error: 'Parameter age failed validation. Expected validator: isInt with options: {"min":18}',
//   object: {},
//   string: '' 
// }

```

# Development

## Test

```
npm test
```