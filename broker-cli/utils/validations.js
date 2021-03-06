const { isInt, isAlpha, isURL, isDecimal: validatorIsDecimal, matches } = require('validator')
const { Big } = require('./big')
/**
 * Largest int64 is our maximum value for amounts
 * @type {String}
 */
const MAX_VALUE = '9223372036854775807'

/**
 * Checks if the specified string is a valid decimal format
 *
 * @param {String} str
 * @returns {String} validated decimal
 * @throws {Error} returns an error if decimal is not a valid format
 */
function isDecimal (str) {
  if ((validatorIsDecimal(str, { decimal_places: '1,19' }) || isInt(str)) && Big(str).lte(MAX_VALUE)) {
    return str
  }

  throw new Error('Invalid decimal format')
}

/**
 * Checks the provided marketName's length
 *
 * @param {String} marketName
 * @returns {Bool} returns true if specified market name is valid
 */
function validMarketNameLength (marketName) {
  return (marketName.length >= 2 && marketName.length <= 5)
}

/**
 * Provides type and length checking for a market name
 *
 * @param {String} str - potential market name
 * @returns {String} validated market name
 * @throws {Error} returns an error if marketname is not valid
 */
function isMarketName (str) {
  try {
    const [base, counter] = str.split('/')

    if (
      isAlpha(base) &&
      validMarketNameLength(base) &&
      isAlpha(counter) &&
      validMarketNameLength(counter)
    ) {
      return str.toUpperCase()
    }

    throw new Error()
  } catch (e) {
    throw new Error('Market Name format is incorrect')
  }
}

/**
 * Checks the provided list of marketnames lengths
 *
 * @param {String} marketNames comma separated
 * @returns {Bool} returns true if all market names are valid
 */
function validMarketNames (marketNames) {
  return marketNames.split(',').every(isMarketName)
}

/**
 * Checks the provided list of marketnames lengths
 *
 * @param {String} marketNames comma separated
 * @returns {String} returns string if all market names are valid
 * @throws {Error} returns an error if not all marketnames are valid
 */
function areValidMarketNames (marketNames) {
  try {
    if (marketNames === '' || validMarketNames(marketNames)) {
      return marketNames
    }
  } catch (e) {
    throw new Error('One or more market names is invalid')
  }
}

/**
 * Checks if a specified string is a valid host.
 *
 * @param {String} str - host address
 * @returns {String}
 * @throws {Error} returns an error if the given string is invalid for an host
 */
function isHost (str) {
  // We can disable the `valid_protocol`, `tld` options and enable `allow_underscores`
  // for now because we use URLs that are local to the container.
  // However, we should remove this in the future to be more strict in our input checking
  if (isURL(str, {
    require_valid_protocol: false,
    require_tld: false,
    allow_underscores: true
  })) {
    return str
  }

  throw new Error('Invalid address')
}

/**
 * Checks if a specified string is a valid path.
 *
 * @param {String} str - path to file
 * @returns {String} the path
 * @throws {Error} returns an error if the given string is not a valid path
 */
// TODO: better path checking
function isFormattedPath (str) {
  if (matches(str, /^.+$/)) {
    return str
  }

  throw new Error('Path format is incorrect')
}

/**
 * Checks if a specified string is a valid block order id.
 *
 * @param  {String}  str - block order id
 * @return {String}     block order id
 * @throws {Error} If string contains more than the allowed characters
 */
function isBlockOrderId (str) {
  if (matches(str, /^[a-zA-Z0-9_-]+$/)) {
    return str
  }

  throw new Error('Block order IDs only contain upper and lower case letters, numbers, dashes (-) and underscores (_).')
}

module.exports = {
  isDecimal,
  isMarketName,
  isHost,
  isFormattedPath,
  areValidMarketNames,
  isBlockOrderId
}
