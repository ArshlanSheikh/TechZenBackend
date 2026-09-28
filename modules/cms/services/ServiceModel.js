import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  icon: { type: String, trim: true, default: "business" },
  color: { type: String, trim: true, default: "#16806c" },
  features: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

serviceSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) this.slug = this.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
});

export default mongoose.model("Service", serviceSchema);