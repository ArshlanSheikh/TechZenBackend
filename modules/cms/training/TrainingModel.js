import mongoose from "mongoose";

const syllabusSectionSchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, trim: true, default: "" },
    topics: { type: [String], default: [] },
  },
  { _id: false }
);

const faqItemSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    totalFee: { type: String, trim: true, default: "" },
    discountedFee: { type: String, trim: true, default: "" },
    pricingType: { type: String, trim: true, default: "Total Program Fee" },
  },
  { _id: false }
);

const certificateSchema = new mongoose.Schema(
  {
    offered: { type: Boolean, default: true },
    details: {
      type: String,
      trim: true,
      default: "Industry-Recognized Certificate of Completion and Project Experience Letter",
    },
  },
  { _id: false }
);

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingCategory",
      default: null,
    },
    categoryName: { type: String, trim: true, default: "" },

    shortDescription: { type: String, trim: true, maxlength: 600, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 6000 },
    image: { type: String, trim: true, default: "" },

    duration: { type: String, trim: true, default: "3 Months" },
    mode: { type: String, trim: true, default: "Hybrid" },
    eligibility: { type: String, trim: true, default: "BCA, MCA, B.Tech, CS/IT Students, or Graduates" },
    batchDetails: { type: String, trim: true, default: "Upcoming Batch Starting Soon" },
    batchStartDate: { type: String, trim: true, default: "" },
    schedule: { type: String, trim: true, default: "" },
    seats: { type: String, trim: true, default: "" },
    contactDetails: {
      phone: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, default: "" },
      whatsapp: { type: String, trim: true, default: "" },
    },

    pricing: { type: pricingSchema, default: () => ({}) },
    fee: { type: String, trim: true, default: "" },

    technologies: { type: [String], default: [] },
    syllabus: { type: [syllabusSectionSchema], default: [] },
    learningOutcomes: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    certificate: { type: certificateSchema, default: () => ({}) },
    faqs: { type: [faqItemSchema], default: [] },

    features: { type: [String], default: [] },
    enquiryButtonText: { type: String, trim: true, default: "Enquire Now" },
    enquiryLink: { type: String, trim: true, default: "/#contact" },

    icon: { type: String, trim: true, default: "code" },
    color: { type: String, trim: true, default: "#2563eb" },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

trainingSchema.pre("validate", function normalizeFields() {
  if (typeof this.projects === "string") {
    this.projects = this.projects.trim() ? [this.projects.trim()] : [];
  }
  if (typeof this.technologies === "string") {
    this.technologies = this.technologies.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof this.benefits === "string") {
    this.benefits = this.benefits.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof this.learningOutcomes === "string") {
    this.learningOutcomes = this.learningOutcomes.split(",").map((s) => s.trim()).filter(Boolean);
  }
});

trainingSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
});

export default mongoose.model("Training", trainingSchema);
