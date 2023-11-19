const express = require('express');
const {GetNotes,AddNote, DeleteNote, UpdateNote, UpdateFav,SetArchive, UpdateTrash} = require('../Controller/useController');
const {registerUser, loginUser,forgotPassword,resetPassword ,authenticated, getUsers, VerifyTokenMiddleware} = require('../Controller/userController');
const {GenerateToken} = require('../Auth/userAuth')
const passport = require('passport');
const { LoginUser } = require('../Repository/userRepo');
const router = express.Router();
//User Router
router.post('/signup', registerUser);
router.post('/login',passport.authenticate('local'), loginUser);
router.post('/authentication',authenticated);
router.get('/userProfile',VerifyTokenMiddleware ,getUsers);
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:id/:token',resetPassword)

//Notes router
router.get('/notes/:id',GetNotes);
router.post('/add',AddNote);
router.delete('/delete/:id',DeleteNote);
router.put('/update/:id', UpdateNote);
router.put('/updateFav/:id',UpdateFav);
router.put('/updateArchive/:id', SetArchive);
router.put('/updateTrash/:id', UpdateTrash);


module.exports = router