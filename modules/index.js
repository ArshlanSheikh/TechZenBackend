import express from 'express'

import InquiryRoutes from './Inquiry/Routes/InquiryRoutes.js';

import OtpRouter from '../Routes/otpRoutes.js';

import UserValidationRoutes from './user/routes/UserValidation.Routes.js';
import userRouter from './user/routes/UserLoginSignup.Routes.js';
import UserAdminRoutes from './user/routes/UserAdmin.Routes.js';
import ProjectRoutes from './cms/projects/ProjectRoutes.js';
import TeamRoutes from './cms/team/TeamRoutes.js';
import ServiceRoutes from './cms/services/ServiceRoutes.js';
import FaqRoutes from './cms/faq/FaqRoutes.js';
import CompanyRoutes from './cms/company/CompanyRoutes.js';
import OverviewRoutes from './cms/overview/OverviewRoutes.js';
import UploadRoutes from './cms/uploads/UploadRoutes.js';



const IndexRoutes = express.Router()


IndexRoutes.use('/api/v1/inquiry',InquiryRoutes)

IndexRoutes.use('/api/v1/otp',OtpRouter)

IndexRoutes.use('/api/v1/user',userRouter)
IndexRoutes.use('/api/v1/user/validation',UserValidationRoutes)
IndexRoutes.use('/api/v1/user/admin',UserAdminRoutes)
IndexRoutes.use('/api/v1/projects', ProjectRoutes)
IndexRoutes.use('/api/v1/team', TeamRoutes)
IndexRoutes.use('/api/v1/services', ServiceRoutes)
IndexRoutes.use('/api/v1/faqs', FaqRoutes)
IndexRoutes.use('/api/v1/company', CompanyRoutes)
IndexRoutes.use('/api/v1/admin/overview', OverviewRoutes)
IndexRoutes.use('/api/v1/admin/uploads', UploadRoutes)


export default IndexRoutes;