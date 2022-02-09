const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const Web3 = require('web3')
const config = require('../config')

router.get(
    '/get-balances',
    body('addresses').isArray(),
    validationHandler,
    getBalances,
)

function validationHandler(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

module.exports = router

async function getBalances(routeReq, routeRes, next) {
  const { body } = routeReq

  const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${config.infuraProjectId}`))
  const validAddresses = [], invalidAddresses = []
  const batch = 50, addresses = body.addresses || []

  for (const section of splitToArrays(addresses, batch)) {
    let retry = true
    while (retry) {
      try {
        await Promise.all(section.map(address => (async function () {
          let balance = 0
          try {
            balance = await web3.eth.getBalance(address)
            balance = web3.utils.fromWei(balance, "ether") / 1
          } catch (e) {
          }
          if (balance === 0) {
            invalidAddresses.push(address)
          } else {
            validAddresses.push({ address, balance })
          }
        })()))
      } catch (e) { // Handle any other error
        await sleep(5000) // Wait 5 seconds
        retry = true
        continue
      }
      retry = false
    }
  }

  routeRes.send({ validAddresses, invalidAddresses })
}

function splitToArrays(array, len) {
  const arr = []
  for (let i = 0; i < array.length; i += len) {
    arr.push(array.slice(i, Math.min(i + len, array.length)))
  }
  return arr
}

async function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}
