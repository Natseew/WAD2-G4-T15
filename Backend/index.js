const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const userRoute = require('./routes/users');
const chatRoute = require('./routes/chat');

const cors = require('cors')
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', userRoute);
app.use('/chat', chatRoute);

app.get('/', (req,res) => {
  console.log("server online")
  res.send()
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

// Correctly export as Vercel expects a function handler
module.exports = app;