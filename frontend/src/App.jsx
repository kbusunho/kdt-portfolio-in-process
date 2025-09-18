
import './App.scss'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminPost from './pages/AdminPost'
import AuthRedirectRoute from './routes/AuthRedirectRoute';
import RequireAuth from './routes/RequireAuth';
import "./styles/main.scss";
import "./styles/_themes.scss"
import "./styles/common.scss"
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,   // 애니메이션 지속시간 (ms)
      once: true,      // 스크롤할 때 1번만 실행
    });
  }, []);
  return (
    <ThemeProvider>

      <Routes>
        <Route path='/' element={<Home />} />
        {/* 로그인 페이지: 이미 인증이면 /admin/posts로 우회 */}
      <Route path="/admin/login" element={<AuthRedirectRoute Component={AdminLogin} />} />
        {/* 보호 페이지: 비인증이면 /admin/login으로 */}
        <Route path="/admin/posts" element={<RequireAuth Component={AdminPost} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App