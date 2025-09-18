// src/lib/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL, // 예: http://localhost:3000
  withCredentials: true,                 // ✅ 쿠키 주고받기
});

// 예시
export async function fetchSomething() {
  const res = await fetch(`${API_URL}/some-endpoint`);
  return res.json();
}

export async function fetchContacts() {
  const res = await fetch(`${API_URL}/api/contacts`, {
    credentials: 'include', // 인증 필요시
  });
  return res.json();
}

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