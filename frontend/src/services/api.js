import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle unauthorized response
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

// Auth API
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  me: () => API.get("/auth/me"),
  register: (data) => API.post("/auth/register", data),
  changePassword: (data) => API.put("/auth/change-password", data),
};

// Users API
export const usersAPI = {
  getAll: (params) => API.get("/users", { params }),
  getById: (id) => API.get(`/users/${id}`),
  create: (data) => API.post("/users", data),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => API.get("/projects"),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post("/projects", data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
};

// Announcements API
export const announcementsAPI = {
  getAll: () => API.get("/announcements"),
  create: (data) => API.post("/announcements", data),
  update: (id, data) => API.put(`/announcements/${id}`, data),
  delete: (id) => API.delete(`/announcements/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => API.get("/dashboard/stats"),
};

export default API;