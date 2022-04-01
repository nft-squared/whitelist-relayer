const {CryptoPunk, IERC721_Temp} = require('./contracts')

const EQ = (addr1, addr2)=>addr1.toLowerCase() == addr2.toLowerCase()
module.exports = {
    async ownerCheck(tokens, owner){
        for(const {token,tokenIDs} of tokens) {
            const ownerOf = EQ(token, CryptoPunk.address) ? CryptoPunk.punkIndexToAddress : IERC721_Temp.attach(token).ownerOf   
            for(const tokenID of tokenIDs) {
                const tokenOwner = await ownerOf(tokenID)
                if(!EQ(owner, tokenOwner)) return false
            }
        }
        return true
    }
}