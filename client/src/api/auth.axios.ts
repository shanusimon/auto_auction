import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api/user/auth",
  withCredentials:true
});
