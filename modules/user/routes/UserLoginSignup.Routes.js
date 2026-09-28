import express from 'express'
import { refreshAccessToken, userLogin, userLogout, userSignup } from '../controllers/UserAuth.Controller.js'
import { Authontication, Authorization } from '../middleware/AuthMiddleware.js'
import { GetUserProfile } from '../controllers/UserBasic.Controller.js'

const userRouter = express.Router()

userRouter.post('/signup',userSignup)
userRouter.post('/login',userLogin)
userRouter.post('/logout',userLogout)
userRouter.get('/refresh-token',refreshAccessToken)
userRouter.get('/profile',Authontication,Authorization(["user","admin"]),GetUserProfile)


// http://localhost:5000/api/v1/user/refresh-token

export default userRouter