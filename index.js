// @flow
import CryptoJS from 'crypto-js'
import sha3 from 'crypto-js/sha3'
import base58Check from 'bs58check'


export const isEthereumAddress = (function() {
  // from web3.js
  // https://github.com/ethereum/web3.js/blob/64c932cff2bffbc97959117b5abc48b6c1c40832/lib/utils/sha3.js
  const sha3Util = (value, options) => {
    if (options && options.encoding === 'hex') {
      if (value.length > 2 && value.substr(0, 2) === '0x') {
        value = value.substr(2)
      }
      value = CryptoJS.enc.Hex.parse(value)
    }

    return sha3(value, {
      outputLength: 256
    }).toString()
  }

  // from web3.js
  // https://github.com/ethereum/web3.js/blob/64c932cff2bffbc97959117b5abc48b6c1c40832/lib/utils/utils.js
  const isChecksumAddress = address => {
    // Check each case
    const cleanAddress = address.replace('0x', '')
    const addressHash = sha3Util(cleanAddress.toLowerCase())

    for (let i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if (
        (parseInt(addressHash[i], 16) > 7 &&
          cleanAddress[i].toUpperCase() !== cleanAddress[i]) ||
        (parseInt(addressHash[i], 16) <= 7 &&
          cleanAddress[i].toLowerCase() !== cleanAddress[i])
      ) {
        return false
      }
    }
    return true
  }

  // from web3.js
  // https://github.com/ethereum/web3.js/blob/64c932cff2bffbc97959117b5abc48b6c1c40832/lib/utils/utils.js
  const isAddress = (address: string) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false
    } else if (
      /^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // If it's all small caps or all all caps, return true
      return true
    } else {
      // Otherwise check each case
      return isChecksumAddress(address)
    }
  }

  return isAddress
})()

export const isLitecoinAddress = (address: string): boolean => {
  // alphabet from https://github.com/cryptocoinjs/bs58/blob/master/index.js
  const looksLike = /^[3LM][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{26,33}$/.test(
    address
  )
  if (!looksLike) return false

  try {
    base58Check.decode(address)
  } catch (error) {
    return false
  }

  return true
}

export const isBitcoinAddress = (address: string): boolean => {
  // alphabet from https://github.com/cryptocoinjs/bs58/blob/master/index.js
  const looksLike = /^[13][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25,34}$/.test(
    address
  )
  if (!looksLike) return false

  try {
    base58Check.decode(address)
  } catch (error) {
    return false
  }

  return true
}

const typeValidatorMap = {
  Bitcoin: isBitcoinAddress,
  Ethereum: isEthereumAddress,
  Litecoin: isLitecoinAddress
}

export type CryptoTypesT = $Keys<typeof typeValidatorMap>

export const addressValidator = (
  type: CryptoTypesT,
  address: string
): boolean => {
  return typeValidatorMap[type](address)
}

export default addressValidator
