# Serverless validator (helper)

Under the hood it use [validator](https://www.npmjs.com/package/validator) module

# Installation

```
npm install serverless-validator
```

# Usage

```javascript
let slsValidator = require('serverless-validator')
let validator = require('validator')

let resp = slsValidator.evaluateParameters(
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
```

# Development

## Test

```
npm test
```