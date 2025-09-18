
import './App.scss'
import Notfound from './pages/NotFound'
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

function App() {

  return (
    <ThemeProvider>

      <Routes>
        <Route path='/' element={<Home />} />
        {/* 로그인 페이지: 이미 인증이면 /admin/posts로 우회 */}
      <Route path="/admin/login" element={<AuthRedirectRoute Component={AdminLogin} />} />
        {/* 보호 페이지: 비인증이면 /admin/login으로 */}
        <Route path="/admin/posts" element={<RequireAuth Component={AdminPost} />} />
        <Route path='*' element={<Notfound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App