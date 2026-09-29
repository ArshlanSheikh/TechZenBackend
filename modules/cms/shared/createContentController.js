const send = (res, status, message, data, error = null) =>
  res.status(status).json({ success: status < 400, message, data, error });

const withSlug = (body) => {
  const normalized = { ...body };
  if (body.title) {
    normalized.slug = body.slug || body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  if (Object.prototype.hasOwnProperty.call(body, "isPublished")) {
    normalized.status = body.isPublished ? "published" : (body.status === "archived" ? "archived" : "draft");
  }
  return normalized;
};

export const createContentController = (Model, { publicFilter = { isActive: true }, sortable = true } = {}) => ({
  listPublic: async (_req, res) => {
    try {
      const query = Model.find(publicFilter);
      if (sortable) query.sort({ displayOrder: 1, createdAt: -1 });
      return send(res, 200, "Content fetched successfully", await query.lean());
    } catch (error) {
      return send(res, 500, "Unable to fetch content", null, error.message);
    }
  },

  listAdmin: async (_req, res) => {
    try {
      const query = Model.find();
      if (sortable) query.sort({ displayOrder: 1, createdAt: -1 });
      return send(res, 200, "Content fetched successfully", await query.lean());
    } catch (error) {
      return send(res, 500, "Unable to fetch content", null, error.message);
    }
  },

  getPublic: async (req, res) => {
    try {
      const item = await Model.findOne({ _id: req.params.id, ...publicFilter }).lean();
      return item
        ? send(res, 200, "Content fetched successfully", item)
        : send(res, 404, "Content not found", null);
    } catch (error) {
      return send(res, 400, "Invalid content id", null, error.message);
    }
  },

  create: async (req, res) => {
    try {
      console.info("[cms db] create started", {
        model: Model.modelName,
        hasImageUrl: typeof req.body.image === "string" && Boolean(req.body.image.trim()),
      });
      const item = await Model.create(withSlug(req.body));
      console.info("[cms db] create succeeded", {
        model: Model.modelName,
        id: item._id.toString(),
        hasImageUrl: Boolean(item.image),
      });
      return send(res, 201, "Content created successfully", item);
    } catch (error) {
      console.error("[cms db] create failed", {
        model: Model.modelName,
        name: error.name || null,
        code: error.code || null,
        message: error.code === 11000 ? "Duplicate value" : error.message,
      });
      return send(res, error.code === 11000 ? 409 : 400, "Unable to create content", null, error.message);
    }
  },

  update: async (req, res) => {
    try {
      console.info("[cms db] update started", {
        model: Model.modelName,
        id: req.params.id,
        hasImageUrl: typeof req.body.image === "string" && Boolean(req.body.image.trim()),
      });
      const item = await Model.findByIdAndUpdate(req.params.id, withSlug(req.body), {
        new: true,
        runValidators: true,
      });
      if (item) {
        console.info("[cms db] update succeeded", {
          model: Model.modelName,
          id: item._id.toString(),
          hasImageUrl: Boolean(item.image),
        });
      } else {
        console.warn("[cms db] update found no record", { model: Model.modelName, id: req.params.id });
      }
      return item
        ? send(res, 200, "Content updated successfully", item)
        : send(res, 404, "Content not found", null);
    } catch (error) {
      console.error("[cms db] update failed", {
        model: Model.modelName,
        name: error.name || null,
        code: error.code || null,
        message: error.code === 11000 ? "Duplicate value" : error.message,
      });
      return send(res, error.code === 11000 ? 409 : 400, "Unable to update content", null, error.message);
    }
  },

  remove: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      return item
        ? send(res, 200, "Content deleted successfully", item)
        : send(res, 404, "Content not found", null);
    } catch (error) {
      return send(res, 400, "Invalid content id", null, error.message);
    }
  },
});