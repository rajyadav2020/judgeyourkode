const express = require('express');

const authRouter = express.Router();
const {register,login,logout,adminRegister} = require('../controller/userAuth');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');



//register user
authRouter.post('/register', register);
authRouter.post('/login', login);

//login user
//logout
authRouter.post('/logout',userMiddleware, logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister )
// authRouter.get('/profile', getProfile);
//get profile

module.exports = authRouter;