import { apiClient } from "@/lib/apiClient";

export const entityService = (baseEndpoint: string) => ({
  getAll: () => apiClient<any[]>(baseEndpoint),
  getById: (id: string) => apiClient<any>(`${baseEndpoint}/${id}`),
  create: (data: any) => apiClient<any>(baseEndpoint, { method: "POST", data }),
  update: (id: string, data: any) => apiClient<any>(`${baseEndpoint}/${id}`, { method: "PUT", data }),
  delete: (id: string) => apiClient<void>(`${baseEndpoint}/${id}`, { method: "DELETE" }),
});
