import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Training from "./TrainingModel.js";
import TrainingCategory from "./TrainingCategoryModel.js";

const send = (res, status, message, data, error = null) =>
  res.status(status).json({ success: status < 400, message, data, error });

const withSlug = async (body) => {
  const normalized = { ...body };
  if (body.title && !body.slug) {
    normalized.slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Populate categoryName if category ID is provided
  if (body.category && mongoose.Types.ObjectId.isValid(body.category)) {
    const cat = await TrainingCategory.findById(body.category).select("name");
    if (cat) normalized.categoryName = cat.name;
  }

  // Ensure repeatable fields are proper arrays
  if (typeof normalized.technologies === "string") {
    normalized.technologies = normalized.technologies.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (typeof normalized.projects === "string") {
    normalized.projects = normalized.projects.trim() ? [normalized.projects.trim()] : [];
  }
  if (typeof normalized.benefits === "string") {
    normalized.benefits = normalized.benefits.split(",").map((b) => b.trim()).filter(Boolean);
  }
  if (typeof normalized.learningOutcomes === "string") {
    normalized.learningOutcomes = normalized.learningOutcomes.split(",").map((o) => o.trim()).filter(Boolean);
  }

  return normalized;
};

export const listPublic = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        filter.category = req.query.category;
      } else {
        filter.categoryName = req.query.category;
      }
    }

    const trainings = await Training.find(filter)
      .populate("category", "name slug")
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return send(res, 200, "Trainings fetched successfully", trainings);
  } catch (error) {
    return send(res, 500, "Unable to fetch trainings", null, error.message);
  }
};

export const listAdmin = async (_req, res) => {
  try {
    const trainings = await Training.find()
      .populate("category", "name slug")
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return send(res, 200, "Trainings fetched successfully", trainings);
  } catch (error) {
    return send(res, 500, "Unable to fetch trainings", null, error.message);
  }
};

export const getBySlugOrId = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);

    const query = isObjectId
      ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
      : { slug: idOrSlug };

    const item = await Training.findOne(query)
      .populate("category", "name slug description")
      .lean();

    if (!item) {
      return send(res, 404, "Training program not found", null);
    }

    if (!item.isActive) {
      let isAdmin = false;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_ACCESS_TOKEN_SECRET);
          if (decoded.role === "admin" || decoded.roles?.includes("admin")) {
            isAdmin = true;
          }
        } catch {
          // not admin
        }
      }
      if (!isAdmin) {
        return send(res, 404, "Training program not found", null);
      }
    }

    return send(res, 200, "Training fetched successfully", item);
  } catch (error) {
    return send(res, 500, "Unable to fetch training", null, error.message);
  }
};

export const getGrouped = async (_req, res) => {
  try {
    const [categories, trainings] = await Promise.all([
      TrainingCategory.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean(),
      Training.find({ isActive: true })
        .populate("category", "name slug")
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean(),
    ]);

    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat._id.toString(), {
        ...cat,
        trainings: [],
      });
    });

    const uncategorized = [];

    trainings.forEach((training) => {
      const catId = training.category?._id?.toString() || training.category?.toString();
      if (catId && categoryMap.has(catId)) {
        categoryMap.get(catId).trainings.push(training);
      } else {
        // Match by categoryName if ObjectId wasn't direct
        let matched = false;
        if (training.categoryName) {
          for (const cat of categoryMap.values()) {
            if (cat.name.toLowerCase() === training.categoryName.toLowerCase()) {
              cat.trainings.push(training);
              matched = true;
              break;
            }
          }
        }
        if (!matched) {
          uncategorized.push(training);
        }
      }
    });

    const result = Array.from(categoryMap.values());
    if (uncategorized.length > 0) {
      result.push({
        _id: "general",
        name: "Skill & General Training",
        slug: "skill-general-training",
        description: "General skill-building and specialized technical training programs",
        trainings: uncategorized,
      });
    }

    return send(res, 200, "Grouped trainings fetched successfully", result);
  } catch (error) {
    return send(res, 500, "Unable to fetch grouped trainings", null, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const payload = await withSlug(req.body);
    const item = await Training.create(payload);
    const populated = await Training.findById(item._id).populate("category", "name slug");
    return send(res, 201, "Training created successfully", populated);
  } catch (error) {
    return send(
      res,
      error.code === 11000 ? 409 : 400,
      "Unable to create training",
      null,
      error.code === 11000 ? "Training slug or title already exists" : error.message
    );
  }
};

export const update = async (req, res) => {
  try {
    const payload = await withSlug(req.body);
    const item = await Training.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!item) return send(res, 404, "Training program not found", null);
    return send(res, 200, "Training updated successfully", item);
  } catch (error) {
    return send(
      res,
      error.code === 11000 ? 409 : 400,
      "Unable to update training",
      null,
      error.code === 11000 ? "Training slug or title already exists" : error.message
    );
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Training.findByIdAndDelete(req.params.id);
    if (!item) return send(res, 404, "Training program not found", null);
    return send(res, 200, "Training deleted successfully", item);
  } catch (error) {
    return send(res, 400, "Invalid training ID", null, error.message);
  }
};

export default {
  listPublic,
  listAdmin,
  getBySlugOrId,
  getGrouped,
  create,
  update,
  remove,
};
