import Project from "./ProjectModel.js";
import { createContentController } from "../shared/createContentController.js";

export default createContentController(Project, { publicFilter: { isPublished: true } });