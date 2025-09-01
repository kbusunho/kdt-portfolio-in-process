import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';
import "./styles/adminLogin.scss";

const AdminLogin = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);//로그인 버튼을 누른 뒤 요청이 처리 중인지 여부”**를 관리
  const [error, setError] = useState(null); // { message }

  const handleChange = (e) => {
      setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);//요청시작
    setError(null);

    try {
      const { data } = await api.post('/api/auth/login', formData, { withCredentials: true });
      if (data?.user) {
        nav('/admin/posts', { replace: true });
        return;
      }
      setError({ message: '로그인에 실패했습니다.' });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      // 423이면 잠김 메시지, 나머지는 일반 메시지
      setError({ message: msg || (status === 423 ? '계정이 잠겨 있습니다.' : '아이디 또는 비밀번호가 올바르지 않습니다.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-header">
        <h3>관리자 로그인</h3>
        <p>관리자 전용 페이지입니다.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-field">
            <label htmlFor="username">관리자 아이디</label>
            <input
              id="username" name="username" type="text" required
              placeholder="관리자 아이디"
              value={formData.username} onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">관리자 비밀번호</label>
            <input
              id="password" name="password" type="password" required
              placeholder="관리자 비밀번호"
              value={formData.password} onChange={handleChange}
            />
          </div>
        </div>

        {error && <div className="error-box">{error.message}</div>}

        <button type="submit" className="login-button" disabled={submitting}>
          {submitting ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
