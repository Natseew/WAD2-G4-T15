const express = require('express');
const router = express.Router();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

//initialise connection using firebase secret
const serviceAccount = require('../wad2-g4-t15-firebase-adminsdk-nzvns-9666048a75.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const ref = db.collection('users')

router.get('/', (req,res) => {
  res.send()
})

//Get User Data
router.get('/:uid', async (req,res) => {
  try{
    const  doc = await ref.doc(req.params.uid).get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
    }
    res.send(doc.data());
  }catch{
    res.sendStatus(500);
  }

})

//Create and Edit User
router.post('/:uid', async (req, res) => {
  
  await ref.doc(req.params.uid).set({
    name: req.body.name,
    age: req.body.age,
    gender:req.body.gender,
    hobbies: req.body.hobbies
    // photos: ?
  }); 

  res.sendStatus(200);
});

module.exports = router
