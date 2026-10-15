import TrainingCategory from "./TrainingCategoryModel.js";

const send = (res, status, message, data, error = null) =>
  res.status(status).json({ success: status < 400, message, data, error });

const withSlug = (body) => {
  const normalized = { ...body };
  if (body.name) {
    normalized.slug =
      body.slug ||
      body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
  }
  return normalized;
};

export const listPublic = async (_req, res) => {
  try {
    const categories = await TrainingCategory.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    return send(res, 200, "Categories fetched successfully", categories);
  } catch (error) {
    return send(res, 500, "Unable to fetch categories", null, error.message);
  }
};

export const listAdmin = async (_req, res) => {
  try {
    const categories = await TrainingCategory.find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    return send(res, 200, "Categories fetched successfully", categories);
  } catch (error) {
    return send(res, 500, "Unable to fetch categories", null, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const category = await TrainingCategory.create(withSlug(req.body));
    return send(res, 201, "Category created successfully", category);
  } catch (error) {
    return send(
      res,
      error.code === 11000 ? 409 : 400,
      "Unable to create category",
      null,
      error.code === 11000 ? "Category name already exists" : error.message
    );
  }
};

export const update = async (req, res) => {
  try {
    const category = await TrainingCategory.findByIdAndUpdate(
      req.params.id,
      withSlug(req.body),
      { new: true, runValidators: true }
    );
    if (!category) return send(res, 404, "Category not found", null);
    return send(res, 200, "Category updated successfully", category);
  } catch (error) {
    return send(
      res,
      error.code === 11000 ? 409 : 400,
      "Unable to update category",
      null,
      error.code === 11000 ? "Category name already exists" : error.message
    );
  }
};

export const remove = async (req, res) => {
  try {
    const category = await TrainingCategory.findByIdAndDelete(req.params.id);
    if (!category) return send(res, 404, "Category not found", null);
    return send(res, 200, "Category deleted successfully", category);
  } catch (error) {
    return send(res, 400, "Invalid category ID", null, error.message);
  }
};

export default {
  listPublic,
  listAdmin,
  create,
  update,
  remove,
};
