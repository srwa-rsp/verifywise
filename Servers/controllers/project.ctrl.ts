import { Request, Response } from "express";
import { MOCKDATA_ON } from "../flags";

import { STATUS_CODE } from "../utils/statusCode.utils";
import {
  createMockProject,
  deleteMockProjectById,
  getAllMockProjects,
  getMockProjectById,
  updateMockProjectById,
} from "../mocks/tools/project.mock.db";
import {
  createNewProjectQuery,
  deleteProjectByIdQuery,
  getAllProjectsQuery,
  getProjectByIdQuery,
  updateProjectByIdQuery,
} from "../utils/project.utils";
import { createMockControlCategory } from "../mocks/tools/controlCategory.mock.db";
import { createMockControl } from "../mocks/tools/control.mock.db";
import { createMockSubcontrol } from "../mocks/tools/subcontrol.mock.db";
import { createControlCategoryQuery } from "../utils/controlCategory.util";
import { createNewControlQuery } from "../utils/control.utils";
import { createNewSubcontrolQuery } from "../utils/subControl.utils";
import { getMockUserById } from "../mocks/tools/user.mock.db";
import { createNewAssessmentQuery } from "../utils/assessment.utils";
import { createMockAssessment } from "../mocks/tools/assessment.mock.db";

export async function getAllProjects(
  req: Request,
  res: Response
): Promise<any> {
  try {
    if (MOCKDATA_ON === true) {
      const projects = getAllMockProjects();

      if (projects) {
        return res.status(200).json(STATUS_CODE[200](projects));
      }

      return res.status(204).json(STATUS_CODE[204](projects));
    } else {
      const projects = await getAllProjectsQuery();

      if (projects) {
        return res.status(200).json(STATUS_CODE[200](projects));
      }

      return res.status(204).json(STATUS_CODE[204](projects));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function getProjectById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const projectId = parseInt(req.params.id);

    if (MOCKDATA_ON === true) {
      const project = getMockProjectById(projectId);

      if (project) {
        return res.status(200).json(STATUS_CODE[200](project));
      }

      return res.status(404).json(STATUS_CODE[404](project));
    } else {
      const project = await getProjectByIdQuery(projectId);

      if (project) {
        return res.status(200).json(STATUS_CODE[200](project));
      }

      return res.status(404).json(STATUS_CODE[404](project));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function createProject(req: Request, res: Response): Promise<any> {
  try {
    const newProject: {
      project_title: string;
      owner: number;
      users: string;
      start_date: Date;
      ai_risk_classification: string;
      type_of_high_risk_role: string;
      goal: string;
      last_updated?: Date;
      last_updated_by?: number;
    } = req.body;

    if (!newProject.project_title || !newProject.owner) {
      return res
        .status(400)
        .json(
          STATUS_CODE[400]({ message: "project_title and owner are required" })
        );
    }

    if (MOCKDATA_ON === true) {
      const createdProject = createMockProject(newProject) as { id: string };
      const assessment = createMockAssessment({ projectId: createdProject.id }) as { id: string, projectId: string };
      console.log("project id ", createdProject.id, ", assessment id ", assessment.id);

      if (createdProject) {
        return res.status(201).json(STATUS_CODE[201]({assessment: assessment, project: createdProject}));
      }

      return res.status(503).json(STATUS_CODE[503]({}));
    } else {
      const createdProject = await createNewProjectQuery(newProject);
      const assessment = await createNewAssessmentQuery({ projectId: createdProject.id });
      console.log("project id ", createdProject.id, ", assessment id ", assessment.id);

      if (createdProject) {
        return res.status(201).json(STATUS_CODE[201]({assessment: assessment, project: createdProject}));
      }

      return res.status(503).json(STATUS_CODE[503]({}));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function updateProjectById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const projectId = parseInt(req.params.id);
    const updatedProject: {
      project_title: string;
      owner: string;
      users: string;
      start_date: Date;
      ai_risk_classification: string;
      type_of_high_risk_role: string;
      goal: string;
      last_updated: Date;
      last_updated_by: string;
    } = req.body;

    if (!updatedProject.project_title || !updatedProject.owner) {
      return res
        .status(400)
        .json(
          STATUS_CODE[400]({ message: "project_title and owner are required" })
        );
    }

    if (MOCKDATA_ON === true) {
      const project = updateMockProjectById(projectId, updatedProject);

      if (project) {
        return res.status(202).json(STATUS_CODE[202](project));
      }

      return res.status(404).json(STATUS_CODE[404]({}));
    } else {
      const project = await updateProjectByIdQuery(projectId, updatedProject);

      if (project) {
        return res.status(202).json(STATUS_CODE[202](project));
      }

      return res.status(404).json(STATUS_CODE[404]({}));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function deleteProjectById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const projectId = parseInt(req.params.id);

    if (MOCKDATA_ON === true) {
      const deletedProject = deleteMockProjectById(projectId);

      if (deletedProject) {
        return res.status(202).json(STATUS_CODE[202](deletedProject));
      }

      return res.status(404).json(STATUS_CODE[404]({}));
    } else {
      const deletedProject = await deleteProjectByIdQuery(projectId);

      if (deletedProject) {
        return res.status(202).json(STATUS_CODE[202](deletedProject));
      }

      return res.status(404).json(STATUS_CODE[404]({}));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function getProjectStatsById(
  req: Request,
  res: Response
): Promise<any> {
  const projectId = parseInt(req.params.id);

  // mock data sections
  // first getting the project by id
  const project: any = getMockProjectById(projectId);

  const project_owner = project.owner; // (A user's id) Now, we get the user by this
  const ownerUser: any = getMockUserById(project_owner);

  const project_last_updated = project.last_updated;

  const project_last_updated_by = project.last_updated_by;
  const userWhoUpdated: any = getMockUserById(project_last_updated_by);

  const overviewDetails = {
    user: {
      name: ownerUser.name,
      surname: ownerUser.surname,
      email: ownerUser.email,
      project_last_updated,
      userWhoUpdated,
    },
  };
}
