import React from 'react'
import aboutMe from '../utils/aboutme'
import "./styles/Aboutme.scss"

const Aboutme = () => {
  const profile = aboutMe.basic
  const skills = aboutMe.skills
  const exper = aboutMe.experiences
  const interests = aboutMe.interests

  // 공통: 인덱스 기반 스태거 딜레이 헬퍼
  const stagger = (base, idx, step = 100) => base + idx * step

  return (
    <div className="inner about-inner">
      <h1 className="tit" data-aos="fade-up">
        aboutme
        <span className="star-spin">
          <i className="star">✱</i>
        </span>
      </h1>

      <div className="t-wrap" data-aos="fade-right" data-aos-delay="500">
        <h2 className='sub-tit'>profile</h2>
        <p className="txt">
          들어가는 최종 요소나 사용된다. <br />
          레이아웃 들어가는 로렘 부르며,
          <br /> 들어가는 최종 전에 프로젝트 사용할 사용된다.
        </p>
      </div>

      <div className="about-container">

        <div className="basic-info" data-aos="fade-up" data-aos-delay="1000">
          <h4 className='list-tit'>list-tit</h4>
          <ul className="lst">
            <li><strong>이름</strong> : {profile.name}</li>
            <li><strong>나이:</strong> {profile.age}세</li>
            <li><strong>사는 곳:</strong> {profile.location}</li>
            <li><strong>MBTI:</strong> {profile.mbti}</li>
          </ul>
        </div>

        {/* Skills: 아이템 개별 스태거 */}
        <div className="skills" data-aos="fade-up" data-aos-delay="1200">
          <h4 className='list-tit'>Skills</h4>
          <ul className="lst">
            {skills.map((skill, idx) => (
              <li
                key={idx}
                data-aos="fade-up"
                data-aos-delay={stagger(1000, idx, 100)}   // 1200ms부터 100ms씩 증가
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Experiences: 아이템 개별 스태거 */}
        <div className="experiences" data-aos="fade-up" data-aos-delay="1500">
          <h4 className='list-tit'>💼 Experiences</h4>
          <ul className='lst'>
            {exper.map((exp, idx) => (
              <li
                key={idx}
                data-aos="fade-up"
                data-aos-delay={stagger(1500, idx, 100)}   // 1500ms부터 120ms씩 증가
              >
                {exp}
              </li>
            ))}
          </ul>
        </div>

        {/* Interests: 아이템 개별 스태거 */}
        <div className="interests" data-aos="fade-up" data-aos-delay="2000">
          <h4 className='list-tit'>🌱 Interests</h4>
          <ul className='lst'>
            {interests.map((interest, idx) => (
              <li
                key={idx}
                data-aos="fade-up"
                data-aos-delay={stagger(2000, idx, 100)}   // 2000ms부터 120ms씩 증가
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Aboutme
 