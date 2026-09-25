import express from 'express'
import { GetAllInquiry, RegisterInquiry,  UpdateInquiry , DeleteInquiry, GetSingleInquiry,} from '../Controller/InquiryController.js'

const InquiryRoutes = express.Router()

InquiryRoutes.get('/all-inquiry',GetAllInquiry,)
InquiryRoutes.get('/:id',GetSingleInquiry)

InquiryRoutes.post('/register',RegisterInquiry)
InquiryRoutes.put('/update/:id',UpdateInquiry)
InquiryRoutes.delete('/delete/:id',DeleteInquiry)



// http://localhost:5000/api/v1/inquiry/regester 

   

export default InquiryRoutes;