import type { MetaResponse } from "./TMetaResponse.type";

export interface EndPoint {
  _id: string;
  name: string;
  method: string;
  category: string;
  route: string;
}

export interface Role {
  _id: string;
  owner: string;
  name: string;
  description?: string;
  endPoints: EndPoint[];
  employees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleResponse {
  result: Role[];
  meta: MetaResponse;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  endPoints: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  endPoints?: string[];
}

export interface RoleQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  role?: string;
}
