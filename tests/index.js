var common = require('../src/index')
var assert = require('chai').assert
var expect = require('chai').expect
const validator = require('validator')

/**---------------------------------------------------------
 * SIMPLE TEST FOR SINGLE EXPECTED PARAM
 *---------------------------------------------------------*/

const expectedParametersFirst = [{
    name: 'id',
    mappedName: 'lCusno',
    required: true,
    validator: validator.isInt
}]

describe('evaluateParameters[1]', (done) => {
    it('Return proper error message: evaluateParameters', () => {
      let resp = common.evaluateParameters({'id': '1xx00'}, expectedParametersFirst)
      assert.equal(resp.error, 'Parameter id failed validation. Expected validator: isInt')
      assert.equal(resp.string, '')
      expect(resp.object).to.eql({})
    })

    it('Return proper error message for required param: evaluateParameters', () => {
        let resp = common.evaluateParameters({'lCusno': '2018'}, expectedParametersFirst)
        assert.equal(resp.error, 'Required parameter id not provided')
        assert.equal(resp.string, '')
        expect(resp.object).to.eql({})
      })

    it('Return proper parameters [1]: evaluateParameters', () => {
        let resp = common.evaluateParameters({'id': '2018'}, expectedParametersFirst)
        assert.equal(resp.error, '')
        assert.equal(resp.string, 'lCusno=2018')
        expect(resp.object).to.eql({"lCusno":"2018"})
    })

    it('Return proper parameters [2]: evaluateParameters', () => {
        let resp = common.evaluateParameters({'id': 2018}, expectedParametersFirst)
        assert.equal(resp.error, '')
        assert.equal(resp.string, 'lCusno=2018')
        expect(resp.object).to.eql({"lCusno":2018})
    })
})

/**---------------------------------------------------------
 * SIMPLE TEST FOR MULTIPLE PARAMS WITH OPTIONS
 *---------------------------------------------------------*/

const expectedParametersSecond = [{
    name: 'id',
    mappedName: 'lCusno',
    required: true,
    validator: validator.isInt
},
{
    name: 'username',
    mappedName: 'kayttajatunnus',
    required: true,
    validator: validator.isAlpha,
}]


describe('evaluateParameters[2]', (done) => {
    it('Return proper error message: evaluateParameters', () => {
        let resp = common.evaluateParameters({
          'id': '100', 'username': 'john.doe'
        }, expectedParametersSecond)
        assert.equal(resp.error, 'Parameter username failed validation. Expected validator: isAlpha')
        assert.equal(resp.string, 'lCusno=100')
    })

    it('Return proper parameters: evaluateParameters', () => {
        let resp = common.evaluateParameters({
            'id': '100', 'username': 'johndoe'
        }, expectedParametersSecond)
        assert.equal(resp.error, '')
        assert.equal(resp.string, 'lCusno=100&kayttajatunnus=johndoe')
    })
})

describe('evaluateParameters[3]', (done) => {
    it('Return proper string: evaluateParameters', () => {
      let resp = common.evaluateParameters(
        {
          'id': '100', 'username': 'johndoe'
        }, [{
            name: 'id',
            mappedName: 'lCusno',
            required: true,
            validator: validator.isInt
        },
        {
            name: 'username',
            mappedName: 'kayttajatunnus',
            required: true,
            validator: validator.isAlpha,
        },
        {
            name: 'phone',
            mappedName: 'phoneNo',
            required: true,
            default: '0441122334'
        }])
        assert.equal(resp.error, '')
        assert.equal(resp.string, 'lCusno=100&kayttajatunnus=johndoe&phoneNo=0441122334')
    })
    it('Return only attributes in schema: evaluateParameters', () => {
      let resp = common.evaluateParameters(
        {
          'id': '100', 'username': 'johndoe', 'phone': '0442222222', 'city': 'Helsinki'
        }, [{
            name: 'id',
            mappedName: 'lCusno',
            required: true,
            validator: validator.isInt
        },
        {
            name: 'username',
            mappedName: 'kayttajatunnus',
            required: true,
            validator: validator.isAlpha,
        },
        {
            name: 'phone',
            mappedName: 'phoneNo',
            required: true,
            default: '0441122334'
        }])
        assert.equal(resp.error, '')
        assert.equal(resp.string, 'lCusno=100&kayttajatunnus=johndoe&phoneNo=0442222222')
    })
})


describe('evaluateParameters[4]', (done) => {
    it('Return proper string: evaluateParameters', () => {
        let resp = common.evaluateParameters(null, [{
              name: 'id',
              mappedName: 'lCusno',
              required: true,
              validator: validator.isInt
          }])
          assert.equal(resp.error, 'Parameters cannot be null!')
      })
});

describe('validateEmptyParams', (done) => {
    it('Return proper error message: validateEmptyParams', () => {
        let [error, value] = common.validateEmptyParams({
            name: 'phone',
            mappedName: 'phoneNo',
            required: true,
            default: '0441122334'
        }, null)
        assert.equal(error, '')
        assert.equal(value, '0441122334')
    })
})

describe('validateParams', (done) => {
    it('Validate params with range should fail [1]', () => {
        let resp = common.evaluateParameters({
            'age': 18
          }, [{
            name: 'age',
            mappedName: 'leAge',
            required: true,
            validator: validator.isInt,
            options: { min: 19 }
        }])

        assert.equal('Parameter age failed validation. Expected validator: isInt with options: {"min":19}', resp.error)
        assert.equal('', resp.string)
    })
    it('Validate params with range should fail [2]', () => {
        let resp = common.evaluateParameters({
            'age': 101
          }, [{
            name: 'age',
            mappedName: 'leAge',
            required: true,
            validator: validator.isInt,
            options: { max: 100 }
        }])

        assert.equal('Parameter age failed validation. Expected validator: isInt with options: {"max":100}', resp.error)
        assert.equal('', resp.string)
    })
    it('Validate params with range should fail [3]', () => {
        let resp = common.evaluateParameters({
            'age': 17
          }, [{
            name: 'age',
            mappedName: 'leAge',
            required: true,
            validator: validator.isInt,
            options: { min: 18 }
        }])
        assert.equal('Parameter age failed validation. Expected validator: isInt with options: {"min":18}', resp.error)
        assert.equal('', resp.string)
    })
    it('Validate params with range should pass [1]', () => {
        let resp = common.evaluateParameters({
            'age': 27
          }, [{
            name: 'age',
            mappedName: 'leAge',
            required: true,
            validator: validator.isInt,
            options: { max: 50 }
        }])

        assert.equal('', resp.error)
        assert.equal('leAge=27', resp.string)
    })
})