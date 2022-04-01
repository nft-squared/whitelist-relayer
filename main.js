const express = require("express");
const bodyParser = require("body-parser");
const { JSONRPCServer } = require("json-rpc-2.0");
const cors = require('cors');
const { IPAddTask } = require('./ElitePad')
const { verifyTypeData } = require('./EIP712')
const { ownerCheck } = require('./IPVerifier');
const { ElitePad } = require('./contracts');

const server = new JSONRPCServer();

const EQ = (addr1, addr2)=>addr1.toLowerCase() == addr2.toLowerCase()
// First parameter is a method name.
// Second parameter is a method itself.
// A method takes JSON-RPC params and returns a result.
// It can also return a promise of the result.
server.addMethod('Authorize', async ({ domain, message, signature }) => {
    const { chainId, verifyingContract } = domain
    const {
        tokens,
        referenceCode,
        //nonce
    } = message
    //console.log(message)
    const account = verifyTypeData('Authorize', domain, message, signature)
    if (!EQ(ElitePad.address, verifyingContract)) throw new Error(`invalid verifyingContract: ${ElitePad.address} != ${verifyingContract}`)
    if(!await ownerCheck(tokens, account)) throw new Error(`invalid token owner`)
    return IPAddTask(tokens, account, referenceCode)
});

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}))

app.post("/auth", (req, res) => {
    const jsonRPCRequest = req.body;
    // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
    // It can also receive an array of requests, in which case it may return an array of responses.
    // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
            res.json(jsonRPCResponse);
        } else {
            // If response is absent, it was a JSON-RPC notification method.
            // Respond with no content status (204).
            res.sendStatus(204);
        }
    });
});
console.log('listen...')
app.listen(8888);