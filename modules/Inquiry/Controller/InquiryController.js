import InquiryModel from "../Models/InquiryModel.js";


const RegesterInquiry = async(req,res)=>{
    try{
        const commingData = req.body

        const RequiredFields =[
            "FullName",
            "Email",
            "Phone",
        ]

        const MissingFields = RequiredFields.fillter((item)=>{
            return(
                commingData[item] === null ||
                commingData[item] === undefined ||
                commingData[item] === ""
            )
        })

        if(missingFields.length > 0){
            return res.status(400).json({success:false,message:"required fields are missing",data:null,error:missingFields})
        }


    }
    catch(error){
        console.log("Failed to handel RegesterInquiry ",error)
        return res.status(500).json({success:false,message:"internall server error",data:null,error:error.message})
    }
}