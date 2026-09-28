import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
  shortDescription: { type: String, trim: true, maxlength: 320, default: "" },
  description: { type: String, trim: true, maxlength: 5000, default: "" },
  image: { type: String, trim: true, default: "" },
  technologies: { type: [String], default: [] },
  category: { type: String, trim: true, default: "" },
  projectUrl: { type: String, trim: true, default: "" },
  githubUrl: { type: String, trim: true, default: "" },
  isPublished: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  this.status = this.isPublished ? "published" : (this.status === "archived" ? "archived" : "draft");
});

export default mongoose.model("Project", projectSchema);