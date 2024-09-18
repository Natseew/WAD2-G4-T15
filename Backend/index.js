const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const userRoute = require('./routes/users');

const cors = require('cors')
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', userRoute);

app.get('/', (req,res) => {
  console.log("server online")
  res.send()
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});