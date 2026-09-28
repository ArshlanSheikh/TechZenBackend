import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  designation: { type: String, required: true, trim: true, maxlength: 120 },
  image: { type: String, trim: true, default: "" },
  bio: { type: String, trim: true, maxlength: 1200, default: "" },
  linkedin: { type: String, trim: true, default: "" },
  github: { type: String, trim: true, default: "" },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("TeamMember", teamSchema);