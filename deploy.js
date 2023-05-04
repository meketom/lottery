require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(process.env.MNEMONIC_PHRASE, process.env.INFURA_API)
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface)
  console.log('Contract deployed to', result.options.address);
  // 0xC05617A073a50EFb2341E5f394C7A3f52eBD4E2A
  provider.engine.stop();
};
deploy();
