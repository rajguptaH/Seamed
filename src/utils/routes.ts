export const API_ROUTES = {
  ships: "/api/ships",
  getInventoryForShip: (id: string) => `/api/ships/${id}/inventory`,
  shipInventory: (shipId: string) => `/api/ships/${shipId}/inventory`,
  companies: "/api/companies",
  company: (id: string) => `/api/companies/${id}`,
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
  },
}
export const API_ENTITIES = {
  ships: "ships",
  companies: "companies",
  users: "users",
}






  