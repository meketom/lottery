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

    it('allows one account to enter',  async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(players[0], accounts[0])
        assert.equal(players.length, 1)
    })

    it('allows multiple account to enter',  async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(players[0], accounts[0])
        assert.equal(players[1], accounts[1])
        assert.equal(players[2], accounts[2])
        assert.equal(players.length, 3)
    })

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: '200' // 200 wei
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
       
    })
})
