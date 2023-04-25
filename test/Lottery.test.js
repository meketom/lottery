const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const {interface, bytecode} = require('../compile')

let accounts
let lottery

beforeEach(async () => {
    // Get a list of all acc.
    accounts = await web3.eth.getAccounts()

    // Use one acc to deploy contract.
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode})
        .send({from: accounts[0], gas: '1000000'})

})

describe('Lottery contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })
})
