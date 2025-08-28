import React from 'react'
import aboutMe from '../utils/aboutme'
import "./styles/Aboutme.scss"
const Aboutme = () => {
  const profile = aboutMe.basic
  const skills = aboutMe.skills
  const exper = aboutMe.experiences
  const interests = aboutMe.interests
  return (

    <div className="inner about-inner">
      <h1 className="tit">aboutme
        <span className="star-spin">
          <i className="star">✱</i>
        </span>
      </h1>
      <div className="t-wrap">

        <h2 className='sub-tit'>profile</h2>
        <p className="txt">들어가는 최종 요소나 사용된다. 레이아웃 들어가는 로렘 부르며, 들어가는 최종 전에 프로젝트 사용할 사용된다. 부르며, 채워지기 프로젝트 타이포그래피,  </p>
      </div>
      <div className="about-container">

        <div className="basic-info">
          <h4 className='list-tit'>list-tit</h4>
          <ul className="about-list">
            <li>
              <strong>이름:</strong> {profile.name}

            </li>
            <li>
              <strong>나이:</strong> {profile.age}세

            </li>
            <li>
              <strong>사는 곳:</strong> {profile.location}

            </li>
            <li>

              <strong>MBTI:</strong> {profile.mbti}
            </li>
          </ul>
        </div>

        <div className="skills">
          <h4 className='list-tit'>Skills</h4>
          <ul className="about-list">
            {skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="experiences">
          <h4 className='list-tit'>
            💼 Experiences
          </h4>
          <ul className='exper-list'>
            {exper.map((exp, idx) => (
              <li key={idx}>{exp}</li>
            ))}
          </ul>
        </div>

        <div className="interests">
          <h4 className='list-tit'>
            🌱 Interests
          </h4>
          <ul className='inter-list'>
            {interests.map((interest, idx) => (
              <li key={idx}>{interest}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>


  )
}

export default Aboutme