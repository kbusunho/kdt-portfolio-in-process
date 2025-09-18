import React, { useState } from 'react'
import "./styles/Contact.scss"
import contact from '../../utils/contact'
import { api } from '../../lib/api'
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "in progress"
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/api/contact", formData)


      if (response.status == 201) {
        alert("문의가 성공적으로 접수!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          status: "in progress"
        })
      }

    } catch (error) {
      console.log("에러 발생",error)
      alert("문의 접수 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요")
    }
  }

  return (
    <div className='inner contact-inner'>
      <h1 className="tit">
        contact
        <span className="star-spin">
          <i className="star">✱</i>
        </span>
      </h1>
      <div className="contact-wrapper">
        <form className='contact-form' onSubmit={handleSubmit}>
          <ul>
            <li>
              <label htmlFor="name" className='label'>이름</label>
              <div className="field">
                <input
                  type="text"
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder='홍길동' />
              </div>
            </li>
            <li>
              <label htmlFor="email" className='label'>이메일</label>
              <div className="field">
                <input
                  id='email'
                  type="email"
                  name='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='example@naver.com' />
              </div>
            </li>
            <li>
              <label htmlFor="phone" className='label'>연락처</label>
              <div className="field">
                <input
                  id='phone'
                  name='phone'
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel" placeholder='010-1234-5678' />
              </div>
            </li>
            <li>
              <label htmlFor="message" className='label'>문의 내용</label>
              <div className="field">
                <textarea
                  value={formData.message}
                  onChange={handleChange}
                  name="message"
                  id="message"
                  rows={7}
                  placeholder='문의 하실 내용을 자세히 적어주세요' required></textarea>
              </div>
            </li>
            <li>
              <div className="field">
                <button type='submit' className='Button'>contact me</button>
              </div>
            </li>
          </ul>

        </form>
        <ul className="contact-lst">
          {contact.basics.map((item) => (
            <li key={item.label}>
              <strong className="label">{item.label}</strong>
              <div className="content">
                <a href={item.href}>{item.value}</a>
                <div className="hint">{item.hint}</div>
              </div>
            </li>

          ))}
          <li>
            <strong className="label">채널</strong>
            <div className="contact-chips">
              {contact.channels.map((item) => (

                <a href={item.href} key={item.label}>
                  {item.label}
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