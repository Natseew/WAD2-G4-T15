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
    uid: req.body.uid || '',
    name: req.body.name || '',
    age: req.body.age || '',
    gender:req.body.gender || '',
    goals:req.body.goals || '',
    hobbies: req.body.hobbies || '',
    religion: req.body.religion || '',
    lookingFor:req.body.lookingFor || '',
    introduction:req.body.introduction || '',
    personalityDescription: req.body.personalityDescription || '',
    loves: req.body.loves || '',
    hates: req.body.hates || '',
    dealbreakers: req.body.dealbreakers || '', 
    images: req.body.images || [],
    likes: req.body.likes || [],
    dislikes: req.body.dislikes || [],
    matches: req.body.matches || []
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
      oppositeGender = 'Female';
    } else if (currentGender.toLowerCase() === 'female') {
      oppositeGender = 'Male';
    } else {
      return res.status(400).send('Unknown gender for current user');
    }

    const oppositeGenderQuery = await ref.where('gender', '==', oppositeGender).get();

    if (oppositeGenderQuery.empty) {
      return res.status(404).send('No users of opposite gender found');
    }

    const likedUserIds = new Set(currentUser.likes?.map(like => like.uid) || []);
    const matchedUserIds = new Set(currentUser.matches?.map(match => match.uid) || []);
    const dislikedUserIds = new Set(currentUser.dislikes?.map(dislike => dislike.uid) || []);

    const users = [];
    oppositeGenderQuery.forEach(doc => {
      const userData = doc.data();

      if (
        !likedUserIds.has(doc.id) &&
        !matchedUserIds.has(doc.id) &&
        !dislikedUserIds.has(doc.id)
      ) {
        users.push(userData);
      }
    });

    res.send(users);

  } catch (error) {
    console.error('Error fetching opposite gender users:', error);
    res.sendStatus(500);
  }
});




router.post('/like/:uid/:likedUserId', async (req, res) => {
  try {
    const { uid, likedUserId } = req.params;

    const userDoc = await ref.doc(uid).get();
    const likedUserDoc = await ref.doc(likedUserId).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    if (!likedUserDoc.exists) {
      return res.status(404).send('Liked user not found');
    }

    const userData = userDoc.data();
    const likedUserData = likedUserDoc.data();
    const likedUserAlreadyLiked = likedUserData.likes?.some(like => like.uid == uid);

    if (likedUserAlreadyLiked) {
      const chatName = `${uid}${likedUserId}`;

      const userMatch = { name: likedUserData.name, chatName, uid: likedUserId };
      const likedUserMatch = { name: userData.name, chatName, uid };

      await ref.doc(uid).update({
        matches: FieldValue.arrayUnion(userMatch),
      });

      await ref.doc(likedUserId).update({
        matches: FieldValue.arrayUnion(likedUserMatch),
      });

      const updatedLikes = likedUserData.likes.filter(like => like.uid !== uid);
      await ref.doc(likedUserId).update({ likes: updatedLikes });

      console.log(`Matched ${uid} with ${likedUserId}`);
      return res.status(200).send('Match created');
    }

    const alreadyLiked = userData.likes?.some(like => like.uid === likedUserId);
    if (alreadyLiked) {
      return res.status(400).send('User already liked');
    }

    await ref.doc(uid).update({
      likes: FieldValue.arrayUnion({
        name: likedUserData.name,
        uid: likedUserId
      })
    });

    console.log(`Liked ${likedUserId} for user ${uid}`);
    return res.sendStatus(200);

  } catch (error) {
    console.error('Error liking user:', error);
    return res.sendStatus(500);
  }
});

router.post('/dislike/:uid/:dislikedUserId', async (req, res) => {

  try {

    const { uid, dislikedUserId } = req.params;

    const userDoc = await ref.doc(uid).get();
    const dislikedUserDoc = await ref.doc(dislikedUserId).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    if (!dislikedUserDoc.exists) {
      return res.status(404).send('Liked user not found');
    }

    const userData = userDoc.data();
    const dislikedUserData = dislikedUserDoc.data();

    const alreadyDisliked = userData.dislikes?.some(dislike => dislike.uid === dislikedUserId);
    if (alreadyDisliked) {
      return res.status(400).send('User already disliked');
    }

    await ref.doc(uid).update({
      dislikes: FieldValue.arrayUnion({
        name: dislikedUserData.name,
        uid: dislikedUserId
      })
    });

    console.log(`Liked ${dislikedUserId} for user ${uid}`);
    return res.sendStatus(200);

  } catch (error){
    console.error('Error disliking user:', error);
    return res.sendStatus(500);
  }

});


module.exports = router
