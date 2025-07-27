export interface Project {
  id: string;
  name: string;
  org_id: string;
  user_id?: string;
  default_agent_id?: string | null;
  created_at?: string;
}

export interface ListProjectsSuccessResponse {
  projects: Project[];
}

export interface GetProjectSuccessResponse {
  project: Project;
}

export interface CreateProjectParams {
  name: string;
}

export interface CreateProjectSuccessResponse {
  id: string;
  name: string;
}

export interface UpdateProjectParams {
  name?: string;
}

export interface UpdateProjectSuccessResponse {
  success: true;
}

export interface DeleteProjectSuccessResponse {
  success: true;
}

export interface SetDefaultAgentParams {
  agent_id: string;
}

export interface SetDefaultAgentSuccessResponse {
  success: true;
}

export interface ClearDefaultAgentSuccessResponse {
  success: true;
}
