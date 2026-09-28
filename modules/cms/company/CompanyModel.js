import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  key: { type: String, default: "main", unique: true },
  name: { type: String, default: "TechZen", maxlength: 160 },
  descriptor: { type: String, default: "", maxlength: 240 },
  email: { type: String, default: "", maxlength: 240 },
  phone: { type: String, default: "", maxlength: 80 },
  location: { type: String, default: "", maxlength: 240 },
  hours: { type: String, default: "", maxlength: 240 },
  introduction: { type: String, default: "", maxlength: 5000 },
  about: { type: String, default: "", maxlength: 10000 },
  mission: { type: String, default: "", maxlength: 3000 },
  vision: { type: String, default: "", maxlength: 3000 },
  whyChooseUs: [{ title: { type: String, trim: true }, description: { type: String, trim: true } }],
  statistics: [{ label: { type: String, trim: true }, value: { type: String, trim: true } }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("CompanyContent", companySchema);