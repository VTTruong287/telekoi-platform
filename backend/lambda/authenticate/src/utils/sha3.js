var BN = require('bn.js');
var ethereumjsUtil = require('ethereumjs-util');

/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 * @param {Object} object
 * @return {Boolean}
 */
var isBN = function (object) {
    return BN.isBN(object);
};

/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
 var isHexStrict = function (hex) {
  return ((typeof hex === 'string' || typeof hex === 'number') && /^(-)?0x[0-9a-f]*$/i.test(hex));
};

/**
 * Hashes values to a sha3 hash using keccak 256
 *
 * To hash a HEX string the hex must have 0x in front.
 *
 * @method sha3
 * @return {String} the sha3 string
 */
 var SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

 var sha3 = function (value) {
     if (isBN(value)) {
         value = value.toString();
     }
 
     if (isHexStrict(value) && /^0x/i.test((value).toString())) {
         value = ethereumjsUtil.toBuffer(value);
     } else if (typeof value === 'string') {
         // Assume value is an arbitrary string
         value = Buffer.from(value, 'utf-8');
     }
 
     var returnValue = ethereumjsUtil.bufferToHex(ethereumjsUtil.keccak256(value));
 
     if(returnValue === SHA3_NULL_S) {
         return null;
     } else {
         return returnValue;
     }
 };


 module.exports = sha3;
 