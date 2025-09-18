import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles/Hero.scss";

const Hero = () => {
  const heroTit = useRef(null);
  const heroTxt = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 제목(h1)
    tl.fromTo(
      heroTit.current,
      { y: 50, opacity: 0 },     // 시작 상태
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" } // 끝 상태
    );

    // 설명(p) - 제목 다음에 실행
    tl.fromTo(
      heroTxt.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.5" // 약간 겹쳐서 실행 (옵션)
    );
  }, []);

  return (
    <div className="inner hero-inner">
      <h1 ref={heroTit} className="tit">
        <span>developer</span>
        <span>
          back <span className="star-spin"><i className="star">✱</i></span> front
        </span>
        <span>portfolio</span>
      </h1>
      <p ref={heroTxt} className="txt">
        시맨틱 마크업을 통해 웹 접근성,
        <br />
        웹 표준을 준수하여 차별이 없는 웹을 지향합니다.
        <br />
        node express - react를  활용한 MERN 프로젝트를 지향하며,
        <br />
        풀스택 전문가로써 성장과 도전을 지향합니다.
        <br />
      </p>
      <div className="arrow">⬇</div>
    </div>
  );
};

export default Hero;
