import express from 'express'
import { GetAllInquiry, RegisterInquiry,  UpdateInquiry , DeleteInquiry, GetSingleInquiry,} from '../Controller/InquiryController.js'
import { Authontication, Authorization } from '../../user/middleware/AuthMiddleware.js'

const InquiryRoutes = express.Router()

InquiryRoutes.get('/all-inquiry',Authontication,Authorization(["admin"]),GetAllInquiry)
InquiryRoutes.get('/:id',Authontication,Authorization(["admin"]),GetSingleInquiry)

InquiryRoutes.post('/register',RegisterInquiry)
InquiryRoutes.put('/update/:id',Authontication,Authorization(["admin"]),UpdateInquiry)
InquiryRoutes.delete('/delete/:id',Authontication,Authorization(["admin"]),DeleteInquiry)



// http://localhost:5000/api/v1/inquiry/regester 

   

export default InquiryRoutes;