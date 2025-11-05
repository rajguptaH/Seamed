export const API_ROUTES = {
  ships: "/api/ships",
  shipInventory: (shipId: string) => `/api/ships/${shipId}/inventory`,
  companies: "/api/companies",
  company: (id: string) => `/api/companies/${id}`,
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
  },
};
