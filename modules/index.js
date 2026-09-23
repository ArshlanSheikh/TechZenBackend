import express from 'express'

import InquiryRoutes from './Inquiry/Routes/InquiryRoutes.js';

import OtpRouter from '../Routes/otpRoutes.js';

import UserValidationRoutes from './user/routes/UserValidation.Routes.js';
import userRouter from './user/routes/UserLoginSignup.Routes.js';
import UserAdminRoutes from './user/routes/UserAdmin.Routes.js';



const IndexRoutes = express.Router()


IndexRoutes.use('/api/v1/inquiry',InquiryRoutes)

IndexRoutes.use('/api/v1/otp',OtpRouter)

IndexRoutes.use('/api/v1/user',userRouter)
IndexRoutes.use('/api/v1/user/validation',UserValidationRoutes)
IndexRoutes.use('/api/v1/user/admin',UserAdminRoutes)


export default IndexRoutes;