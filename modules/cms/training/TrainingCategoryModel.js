import mongoose from "mongoose";

const trainingCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
    slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    description: { type: String, trim: true, default: "", maxlength: 500 },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

trainingCategorySchema.pre("validate", function setSlug() {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
});

export default mongoose.model("TrainingCategory", trainingCategorySchema);
