import UserModel from "../models/UserModel.js";



const GetUserProfile = async (req, res) => {
  try {

    console.log("Hit GetUserProfile Api...");

    const userId = req.user.userId;

    const user = await UserModel.findById(userId).select("-password -refreshToken").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null
      });
    }

    const profile = {
      ...user,
      role: user.role === "admin" || user.roles?.includes("admin") ? "admin" : "user",
    };

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: profile,
      error: null
    });

  } 
  catch (error) {
    console.log("Failed to handle GetUserProfile",error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: error.message
    });

  }
};



export {GetUserProfile}