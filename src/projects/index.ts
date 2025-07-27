import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  ClearDefaultAgentSuccessResponse,
  CreateProjectParams,
  CreateProjectSuccessResponse,
  DeleteProjectSuccessResponse,
  GetProjectSuccessResponse,
  ListProjectsSuccessResponse,
  SetDefaultAgentParams,
  SetDefaultAgentSuccessResponse,
  UpdateProjectParams,
  UpdateProjectSuccessResponse,
} from "./types";

export class Projects {
  constructor(private readonly phonic: Phonic) {}

  async list(): DataOrError<ListProjectsSuccessResponse> {
    return this.phonic.get<ListProjectsSuccessResponse>("/projects");
  }

  async get(id: string): DataOrError<GetProjectSuccessResponse> {
    return this.phonic.get<GetProjectSuccessResponse>(`/projects/${id}`);
  }

  async create(
    params: CreateProjectParams,
  ): DataOrError<CreateProjectSuccessResponse> {
    return this.phonic.post<CreateProjectSuccessResponse>("/projects", {
      name: params.name,
    });
  }

  async update(
    id: string,
    params: UpdateProjectParams,
  ): DataOrError<UpdateProjectSuccessResponse> {
    return this.phonic.put<UpdateProjectSuccessResponse>(`/projects/${id}`, {
      name: params.name,
    });
  }

  async delete(id: string): DataOrError<DeleteProjectSuccessResponse> {
    return this.phonic.delete<DeleteProjectSuccessResponse>(`/projects/${id}`);
  }

  async setDefaultAgent(
    id: string,
    params: SetDefaultAgentParams,
  ): DataOrError<SetDefaultAgentSuccessResponse> {
    return this.phonic.put<SetDefaultAgentSuccessResponse>(
      `/projects/${id}/default-agent`,
      {
        agent_id: params.agent_id,
      },
    );
  }

  async clearDefaultAgent(
    id: string,
  ): DataOrError<ClearDefaultAgentSuccessResponse> {
    return this.phonic.delete<ClearDefaultAgentSuccessResponse>(
      `/projects/${id}/default-agent`,
    );
  }
}
