// src/lib/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 예: http://localhost:3000
  withCredentials: true,                 // ✅ 쿠키 주고받기
});


// 401 나오면 전역에서 바로 로그인 페이지로
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       window.location.href = "/admin/login";
//     }
//     return Promise.reject(err);
//   }
// );