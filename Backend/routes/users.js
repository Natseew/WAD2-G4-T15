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
    name: req.body.name || '',
    age: req.body.age || '',
    gender:req.body.gender || '',
    goals:req.body.goals || '',
    introduction:req.body.introduction || '',
    lookingFor:req.body.lookingFor || '',
    hobbies: req.body.hobbies || '',
    loves: req.body.loves || '',
    hates: req.body.hates || '',
    personalityDescription: req.body.personalityDescription || '',
    images: req.body.images || []
  }); 

  res.sendStatus(200);
});

router.post('/populate_homepage/:uid', async (req, res) => {
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

router.post('/like', async (req, res) => {
  const { uid, likedUserId } = req.body;

  try {

    const userDoc = await ref.doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();

    const alreadyLiked = userData.likes?.some(like => like.uid === likedUserId);

    if (alreadyLiked) {
      return res.status(400).send('User already liked');
    }

    const likedUserDoc = await ref.doc(likedUserId).get();

    if (!likedUserDoc.exists) {
      return res.status(404).send('Liked user not found');
    }

    const likedUserData = likedUserDoc.data();

    await ref.doc(userId).update({
      likes: FieldValue.arrayUnion({
        name: likedUserData.name,
        uid: likedUserId
      })
    });

    return res.sendStatus(200);

  } catch (error) {
    console.error('Error liking user:', error);
    return res.sendStatus(500);
  }
});

module.exports = router
