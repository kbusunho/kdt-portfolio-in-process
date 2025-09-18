import React from 'react'
import "./styles/Hero.scss"
const Hero = () => {
  return (
    <div className='inner hero-inner'>
      <h1 className="tit">
        <span>
          developer
        </span>
        <span>

          back <span className="star-spin"><i className="star">✱</i></span> front
        </span>
        <span>
          portfolio
        </span>
      </h1>
      <p className="txt">
        시맨틱 마크업을 통해 웹 접근성, <br />
        웹 표준을 준수하여 차별이 없는 웹을 지향합니다. <br />
        node express - react를 활용한 MERN 프로젝트를 지향하며, <br />
        풀스택 전문가로써 성장과 도전을 지향합니다.
    
      </p>
      <div className="arrow">
        ⬇
      </div>
    </div>
  )
}

export default Hero