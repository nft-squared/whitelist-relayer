const { ethers } = require('ethers')
const { ElitePad } = require('./contracts')
async function IPAdd(tokens, owner, referenceCode) {
    const tokenAddresses = tokens.map(token => token.token)
    const tokenesIDs = tokens.map(token => token.tokenIDs)
    return ElitePad.addAuths(tokenAddresses, tokenesIDs, owner, referenceCode)
}

let promise = Promise.resolve()
module.exports = {
    IPAddTask(tokens, owner, referenceCode) {
        const bytes32 = Buffer.alloc(32)
        if (ethers.utils.isAddress(referenceCode)) {
            bytes32.hexWrite(referenceCode.startsWith('0x') ? referenceCode.slice(2) : referenceCode, 12)
        } else {
            const offset = bytes32.length - referenceCode.length
            bytes32.hexWrite(referenceCode, offset < 0 ? 0 : offset)
        }
        return new Promise((resolve, reject) => {
            promise = promise.then(
                () => IPAdd(tokens, owner, bytes32)
                    .then(tx => resolve({ hash: tx.hash }))
                    .catch(err => reject(new Error(err)))
            )
        })
    }
}