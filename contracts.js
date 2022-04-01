const { abi:ElitePad_ABI } = require('./abis/ElitePad.json')
const {'1666700000':Deployed} = require('./abis/record_test.json')
const NodeUrl = 'https://api.s0.b.hmny.io'
const ethers = require('ethers')
const { Wallet } = require('ethers')
const { FromKeystore } = require('./wallet')
const fs = require('fs')
const hmyProvider = new ethers.providers.StaticJsonRpcProvider(NodeUrl)
const keystoreStr = fs.readFileSync(process.env.KEYSTORE)
const hmySigner = new Wallet(FromKeystore(keystoreStr, process.env.PASSWD), hmyProvider)
const ElitePad = new ethers.Contract(Deployed.ElitePad, ElitePad_ABI, hmySigner)

const { abi:IERC721_ABI } = require('./abis/IERC721.json')
const CryptoPunk_ABI = require('./abis/CryptoPunksMarket.abi.json')
const PunkAddress = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
const ethProvider = new ethers.providers.StaticJsonRpcProvider('https://mainnet.infura.io/v3/1a2431ca526c4e50a0a01f861e48642a')
const CryptoPunk = new ethers.Contract(PunkAddress, CryptoPunk_ABI, ethProvider)
const IERC721_Temp = new ethers.Contract(ethers.constants.AddressZero, IERC721_ABI, ethProvider)

module.exports = {
    ElitePad,
    CryptoPunk,
    IERC721_Temp
}