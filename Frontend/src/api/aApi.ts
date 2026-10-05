import { apiRequest } from "./apiClient";
import { AEntity } from "../types/a";

const baseUrl = "/api/AEntities";

export async function getAEntities(): Promise<AEntity[]> {
  return apiRequest<AEntity[]>(baseUrl);
}

export async function getAEntity(id: number): Promise<AEntity> {
  return apiRequest<AEntity>(`${baseUrl}/${id}`);
}

export async function createAEntity(payload: Omit<AEntity, "id">): Promise<AEntity> {
  return apiRequest<AEntity>(baseUrl, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAEntity(id: number, payload: Omit<AEntity, "id">): Promise<AEntity> {
  return apiRequest<AEntity>(`${baseUrl}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAEntity(id: number): Promise<void> {
  await apiRequest<void>(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
}
