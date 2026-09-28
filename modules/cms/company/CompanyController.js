import CompanyContent from "./CompanyModel.js";

const response = (res, status, message, data, error = null) =>
  res.status(status).json({ success: status < 400, message, data, error });

export const getCompany = async (_req, res) => {
  try {
    const content = await CompanyContent.findOne({ key: "main" }).lean();
    return response(res, 200, "Company content fetched successfully", content);
  } catch (error) {
    return response(res, 500, "Unable to fetch company content", null, error.message);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, descriptor, email, phone, location, hours, introduction, about, mission, vision, whyChooseUs, statistics } = req.body;
    const content = await CompanyContent.findOneAndUpdate(
      { key: "main" },
      { name, descriptor, email, phone, location, hours, introduction, about, mission, vision, whyChooseUs, statistics, updatedBy: req.user.userId },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return response(res, 200, "Company content saved successfully", content);
  } catch (error) {
    return response(res, 400, "Unable to save company content", null, error.message);
  }
};