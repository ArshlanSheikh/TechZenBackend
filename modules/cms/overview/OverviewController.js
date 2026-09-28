import Inquiry from "../../Inquiry/Models/InquiryModel.js";
import Project from "../projects/ProjectModel.js";
import TeamMember from "../team/TeamModel.js";
import Service from "../services/ServiceModel.js";
import Faq from "../faq/FaqModel.js";

export const getOverview = async (_req, res) => {
  try {
    const [totalInquiries, pendingInquiries, contactedInquiries, completedInquiries, totalProjects, totalTeamMembers, totalServices, recentInquiries, recentProjects, totalFaqs] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: { $in: ["new", "pending"] } }),
      Inquiry.countDocuments({ status: "contacted" }),
      Inquiry.countDocuments({ status: "completed" }),
      Project.countDocuments(),
      TeamMember.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      Project.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).lean(),
      Faq.countDocuments({ isActive: true }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        inquiries: { total: totalInquiries, pending: pendingInquiries, contacted: contactedInquiries, completed: completedInquiries, recent: recentInquiries },
        projects: { total: totalProjects, recent: recentProjects },
        teamMembers: totalTeamMembers,
        services: totalServices,
        faqs: totalFaqs,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load dashboard overview", data: null, error: error.message });
  }
};