import React from 'react'
import Nav from "./Nav"
import "./styles/Header.scss"
const Header = () => {
  return (
    <header>
      <div className="inner">
        <h4>LOGO</h4>
        <div className="right-wrap">

          <Nav />
          <button>DARK</button>
        </div>
      </div>
    </header>
  )
}

export default Header