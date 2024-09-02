const express = require('express')
const app = express()
const port = 3000

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

//initialise connection using firebase secret
const serviceAccount = require('../Backend/wad2-g4-t15-firebase-adminsdk-nzvns-9666048a75.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.post('/', async (req, res) => {
    const docRef = db.collection('users').doc('alovelace');

    await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815
    }); 

    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})