import axios from "axios";

export const BASE_URL = "https://backend1-l5g4.onrender.com";
export const clientServer = axios.create({
  baseURL: BASE_URL,
});
