import axios from "axios";
export const baseURL = "https://hive-chat-server.onrender.com";
export const httpClient = axios.create({
  baseURL: baseURL,
});