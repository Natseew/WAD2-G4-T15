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
    res.send("test")
})

//Get User Data
router.get('/:uid', async (req,res) => {
  try{
    const  doc = await ref.doc(req.params.uid).get();
    if (!doc.exists) {
      res.status(400).send('No such document!');
    } else {
      // console.log('Document data:', doc.data());
      res.send(doc.data());
    }
  }catch (error){
    console.log(error)
    res.sendStatus(500);
  }

})

//Create and Edit User
router.post('/:uid', async (req, res) => {

  await ref.doc(req.params.uid).set({
    name: req.body.name,
    age: req.body.age,
    gender:req.body.gender,
    hobbies: req.body.hobbies,
    images: req.body.images
    // photos: ?
  }); 

  res.sendStatus(200);
});

router.post('/populate_homepage', async (req, res) => {
  try {

    const currentUserDoc = await ref.doc(req.params.uid).get();

    if (!currentUserDoc.exists) {
      return res.status(400).send('No such document for current user!');
    }

    const currentUser = currentUserDoc.data();
    const currentGender = currentUser.gender;

    let oppositeGender;
    if (currentGender.toLowerCase() === 'male') {
      oppositeGender = 'female';
    } else if (currentGender.toLowerCase() === 'female') {
      oppositeGender = 'male';
    } else {
      return res.status(400).send('Unknown gender for current user');
    }

    const oppositeGenderQuery = await ref.where('gender', '==', oppositeGender).get();

    if (oppositeGenderQuery.empty) {
      return res.status(404).send('No users of opposite gender found');
    }

    const users = [];
    oppositeGenderQuery.forEach(doc => {
      users.push(doc.data());
    });

    res.send(users);

  } catch (error) {
    console.error('Error fetching opposite gender users:', error);
    res.sendStatus(500);
  }
});

module.exports = router
