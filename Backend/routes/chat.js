require("dotenv").config()
const express = require("express")
const twilio = require("twilio");
const router = express.Router();

const AccessToken = require("twilio").jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

// Used when generating any kind of tokens
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioApiKey = process.env.TWILIO_API_KEY_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiSecret = process.env.TWILIO_API_KEY_SECRET

// Used specifically for creating Chat tokens
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

const client = twilio(twilioAccountSid , authToken);

// Create a "grant" which enables a client to use Chat as a given user,
// on a given device
const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
})

// Create an access token which we will sign and return to the client,
// containing the grant we just created
function getAccessToken(user) {
    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        {identity: user}
    )
    token.addGrant(chatGrant)
    const jwt = token.toJwt()
    console.log(`Token for ${user}: ${jwt}`)
    return jwt
}

router.get("/auth/:user", (req, res) => {
    const jwt = getAccessToken(req.params.user)
    res.send({token: jwt})
})

router.get("/create", async (req,res) => {
    const conversation = await client.conversations.v1.conversations.create({
        friendlyName: "Testing",
    });
    
    res.send(conversation.chatServiceSid)
})

module.exports = router
