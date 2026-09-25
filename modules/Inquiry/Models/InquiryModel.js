import mongoose from "mongoose";

const InquiryModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 160,
        },

        phone: {
            type: String,
            trim: true,
            maxlength: 10,
            minlength:10,
        },

        company: {
            type: String,
            trim: true,
            maxlength: 160,
            default:"private"
        },

        service: {
            type: String,
            required: true,
            trim: true,
        },

        contactMethod: {
            type: String,
            enum: ["Email", "Phone", "WhatsApp", "Video call"],
            default: "Email",
        },

        message: {
            type: String,
            trim: true,
            minlength: 20,
            maxlength: 2000,
        },
        status:{
            type: String,
            required: true,
            trim: true,
        }

    },
    {
        timestamps:true
    }
)

const InquiryModel = mongoose.model('InquiryModel',InquiryModelSchema)

export default  InquiryModel