import { apiClient } from "@/lib/apiClient";
import { IShip } from "@/types";
import { API_ROUTES } from "@/utils/routes";

export const shipService = {
  getAll: (params?: Record<string, any>) =>
    apiClient<IShip[]>(API_ROUTES.ships, { params }),

  getById: (id: string) =>
    apiClient<IShip>(`${API_ROUTES.ships}/${id}`),

  create: (data: Omit<IShip, "id">) =>
    apiClient<IShip>(API_ROUTES.ships, { method: "POST", data }),

  update: (id: string, data: Partial<IShip>) =>
    apiClient<IShip>(`${API_ROUTES.ships}/${id}`, { method: "PUT", data }),

  delete: (id: string) =>
    apiClient<void>(`${API_ROUTES.ships}/${id}`, { method: "DELETE" }),
};
