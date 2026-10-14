const express = require('express');

const authRouter = express.Router();



//register user
authRouter.post('/register', register);
authRouter.post('/login', login);

//login user
//logout
authRouter.post('/logout', logout);
authRouter.get('/profile', getProfile);
//get profile