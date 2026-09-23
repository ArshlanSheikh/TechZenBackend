import InquiryModel from "../Models/InquiryModel.js";






// ============================================
// Get Single Inquiri By id
// ============================================
const GetSingleInquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const Inquiry = await InquiryModel.findById(id);

        if (!Inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
                data: null,
                error: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inquiry fetched successfully",
            data: Inquiry,
            error: null,
        });
    }
    catch (error) {
        console.log("Failed to handle GetSingleInquiry", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message,
        });
    }
};




// ============================================
// Get All Inquiries
// ============================================

const GetAllInquiry = async (req, res) => {
    try {

        const AllInquiry = await InquiryModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Inquiries fetched successfully",
            data: AllInquiry,
            error: null,
        });
    } 
    catch (error) {
        console.log("Failed to handle GetAllInquiry", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message,
        });
    }
};




// ============================================
// Register Inquiry
// ============================================
const RegisterInquiry = async (req, res) => {
    try {
        const commingData = req.body;

        const RequiredFields = [
            "name",
            "email",
            "service",
            "message",
            "status",
        ];

        const MissingFields = RequiredFields.filter((item) => {
            return (
                commingData[item] === null ||
                commingData[item] === undefined ||
                commingData[item] === ""
            );
        });

        if (MissingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                data: null,
                error: MissingFields,
            });
        }

        const NewInquiry = await InquiryModel.create(commingData);

        return res.status(201).json({
            success: true,
            message: "Inquiry registered successfully",
            data: NewInquiry,
            error: null,
        });
    } 
    catch (error) {
        console.log("Failed to handle RegesterInquiry", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message,
        });
    }
};




// ============================================
// Update Inquiry
// ============================================
const UpdateInquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const UpdatedInquiry = await InquiryModel.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!UpdatedInquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
                data: null,
                error: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inquiry updated successfully",
            data: UpdatedInquiry,
            error: null,
        });
    } 
    catch (error) {
        console.log("Failed to handle UpdateInquiry", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message,
        });
    }
};


// ============================================
// Delete Inquiry
// ============================================
const DeleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const DeletedInquiry = await InquiryModel.findByIdAndDelete(id);

        if (!DeletedInquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
                data: null,
                error: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inquiry deleted successfully",
            data: DeletedInquiry,
            error: null,
        });
    } 
    catch (error) {
        console.log("Failed to handle DeleteInquiry", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message,
        });
    }
};


export {
    GetSingleInquiry,
    GetAllInquiry,
    RegisterInquiry,
    UpdateInquiry,
    DeleteInquiry,
};