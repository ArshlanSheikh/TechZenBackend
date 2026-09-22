import express from 'express'

import InquiryRoutes from './Inquiry/Routes/InquiryRoutes.js';

const IndexRoutes = express.Router()


IndexRoutes.use('/inquiry',InquiryRoutes)



export default IndexRoutes;