'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressValidator = exports.isBitcoinAddress = exports.isLitecoinAddress = exports.isEthereumAddress = undefined;

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _sha = require('crypto-js/sha3');

var _sha2 = _interopRequireDefault(_sha);

var _bs58check = require('bs58check');

var _bs58check2 = _interopRequireDefault(_bs58check);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isEthereumAddress = exports.isEthereumAddress = function () {
  // from web3.js
  // https://github.com/ethereum/web3.js/blob/64c932cff2bffbc97959117b5abc48b6c1c40832/lib/utils/sha3.js
  var sha3Util = function sha3Util(value, options) {
    if (options && options.encoding === 'hex') {
      if (value.length > 2 && value.substr(0, 2) === '0x') {
        value = value.substr(2);
      }
      value = _cryptoJs2.default.enc.Hex.parse(value);
    }

    return (0, _sha2.default)(value, {
      outputLength: 256
    }).toString();
  };

  // from web3.js
  // https://github.com/ethereum/web3.js/blob/64c932cff2bffbc97959117b5abc48b6c1c40832/lib/utils/utils.js
  var isChecksumAddress = function isChecksumAddress(address) {
    // Check each case
    var cleanAddress = address.replace('0x', '');
    var addressHash = sha3Util(cleanAddress.toLowerCase());

    for (var i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if (parseInt(addressHash[i], 16) > 7 && cleanAddress[i].toUpperCase() !== cleanAddress[i] || parseInt(addressHash[i], 16) <= 7 && cleanAddress[i].toLowerCase() !== cleanAddress[i]) {
        return false;
      }
    }
    return true;
  };

  // from web3.js
  // https://github.com/ethereum/web3.js/blob/64c932cff2bffbc97959117b5abc48b6c1c40832/lib/utils/utils.js
  var isAddress = function isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
    } else {
      // Otherwise check each case
      return isChecksumAddress(address);
    }
  };

  return isAddress;
}();
var isLitecoinAddress = exports.isLitecoinAddress = function isLitecoinAddress(address) {
  // alphabet from https://github.com/cryptocoinjs/bs58/blob/master/index.js
  var looksLike = /^[3LM][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{26,33}$/.test(address);
  if (!looksLike) return false;

  try {
    _bs58check2.default.decode(address);
  } catch (error) {
    return false;
  }

  return true;
};

var isBitcoinAddress = exports.isBitcoinAddress = function isBitcoinAddress(address) {
  // alphabet from https://github.com/cryptocoinjs/bs58/blob/master/index.js
  var looksLike = /^[13][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25,34}$/.test(address);
  if (!looksLike) return false;

  try {
    _bs58check2.default.decode(address);
  } catch (error) {
    return false;
  }

  return true;
};

var typeValidatorMap = {
  Bitcoin: isBitcoinAddress,
  Ethereum: isEthereumAddress,
  Litecoin: isLitecoinAddress
};

var addressValidator = exports.addressValidator = function addressValidator(type, address) {
  return typeValidatorMap[type](address);
};

exports.default = addressValidator;