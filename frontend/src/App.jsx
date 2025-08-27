
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import AdminLogin from "./pages/AdminLogin"
import AdminPost from "./pages/AdminPost"
import Notfound from "./pages/Notfound"
import AuthRedirectRoute from './routes/AuthRedirectRoute'
import RequireAuth from './routes/RequireAuth';
import "./styles/main.scss"
import "./styles/_themes.scss"
import './styles/common.scss'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/admin/login" element={<AuthRedirectRoute Component={AdminLogin} />} />

      <Route path="/admin/post" element={<RequireAuth Component={AdminPost} />} />
      <Route path='*' element={<Notfound />} />
    </Routes>
  )
}

export default App
