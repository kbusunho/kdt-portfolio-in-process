import React, { useState } from 'react'
import contact from '../utils/contact'
import "./styles/Contact.scss"
import { api } from '../lib/api';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "in progress",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post("/api/contact", formData
      )

      if (response.status === 201) {
        alert("문의가 성공적 접수!11")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          status: "in progress"
        })
      }
    } catch (error) {
      console.log("에러 발생: ", error);
      alert("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className='inner contact-inner'>
      <div data-aos="fade-right" className='t-wrap'>

      <h1 className="tit" >contact me
        <span className="star-spin">
          <i className="star">✱</i>
        </span>
      </h1>
      </div>
      <div className="contact-wrapper">

        <form 
        className="contact-form" onSubmit={handleSubmit}>
          <ul className="form-rows">
            <li className="row">
              <label htmlFor="name" className="label">
                이름
              </label>
              <div className="field">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </li>

            <li className="row">
              <label htmlFor="email" className="label">
                이메일
              </label>
              <div className="field">
                <input
                  id="email"
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </li>

            <li className="row">
              <label htmlFor="phone" className="label">
                연락처
              </label>
              <div className="field">
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="010-1234-5678"
                />
              </div>
            </li>

            <li className="row">
              <label htmlFor="message" className="label">
                문의내용
              </label>
              <div className="field">
                <textarea
                  id="message"
                  onChange={handleChange}
                  name="message"
                  value={formData.message}
                  rows={7}
                  placeholder="문의하실 내용을 자세히 적어주세요."
                  required
                />
              </div>
            </li>

            <li className="row actions">
              <span className="label" aria-hidden="true" />
              <div className="field">
                <button type="submit" className="Button">
                  CONTACT ME
                </button>
              </div>
            </li>
          </ul>
        </form>
        {/* ContactList.jsx */}
        <ul className="contact-list"
        
        >
          {contact.basics.map(item => (
            <li key={item.label}>
              <strong className="label">
                {/* <span className="material-symbols-outlined">{item.icon}</span> */}
                {item.label}
              </strong>
              <div className="content">
                <a href={item.href} className="value">{item.value}</a>
                {item.hint && <small className="hint">{item.hint}</small>}
              </div>
            </li>
          ))}
          <li className="channels">
            <strong className="label">채널</strong>
            <div className="content chips">
              {contact.channels.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="chip">
                  {c.label}
                </a>
              ))}
            </div>
          </li>
        </ul>
      </div>

    </div>
  )
}

export default Contact