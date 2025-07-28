import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  CreateProjectParams,
  CreateProjectSuccessResponse,
  DeleteProjectSuccessResponse,
  GetProjectSuccessResponse,
  ListProjectsSuccessResponse,
  UpdateProjectParams,
  UpdateProjectSuccessResponse,
} from "./types";

export class Projects {
  constructor(private readonly phonic: Phonic) {}

  async list(): DataOrError<ListProjectsSuccessResponse> {
    const response =
      await this.phonic.get<ListProjectsSuccessResponse>("/projects");

    return response;
  }

  async get(nameOrId: string): DataOrError<GetProjectSuccessResponse> {
    const response = await this.phonic.get<GetProjectSuccessResponse>(
      `/projects/${nameOrId}`,
    );

    return response;
  }

  async create(
    params: CreateProjectParams,
  ): DataOrError<CreateProjectSuccessResponse> {
    const response = await this.phonic.post<CreateProjectSuccessResponse>(
      "/projects",
      {
        name: params.name,
      },
    );

    return response;
  }

  async update(
    nameOrId: string,
    params: UpdateProjectParams,
  ): DataOrError<UpdateProjectSuccessResponse> {
    const response = await this.phonic.patch<UpdateProjectSuccessResponse>(
      `/projects/${nameOrId}`,
      {
        name: params.name,
        default_agent: params.defaultAgent,
      },
    );

    return response;
  }

  async delete(nameOrId: string): DataOrError<DeleteProjectSuccessResponse> {
    const response = await this.phonic.delete<DeleteProjectSuccessResponse>(
      `/projects/${nameOrId}`,
    );

    return response;
  }
}
