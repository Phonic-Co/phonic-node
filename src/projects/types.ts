type Project = {
  id: string;
  name: string;
  default_agent: {
    id: string;
    name: string;
  } | null;
};

export type ListProjectsSuccessResponse = {
  projects: Array<Project>;
};

export type GetProjectSuccessResponse = {
  project: Project;
};

export type CreateProjectParams = {
  name: string;
};

export type CreateProjectSuccessResponse = {
  id: string;
  name: string;
};

export type UpdateProjectParams = {
  name?: string;
  defaultAgent?: string;
};

export type UpdateProjectSuccessResponse = {
  success: true;
};

export type DeleteProjectSuccessResponse = {
  success: true;
};
