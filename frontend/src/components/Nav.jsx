import React from 'react'
import useSmoothScroll from '../hook/useSmoothScroll'
import "./styles/Nav.scss"
const Nav = ({ open = false, onClose = () => { } }) => {
  const navLink = ['Hero', 'Contact', 'Work', 'Aboutme']


  const scrollTo = useSmoothScroll()
  return (
    <nav className={`Nav ${open ? 'open' : ''}`} aria-label="주요 메뉴">

      <ul id="primary-menu" role="menu">
        {navLink.map((nav, i) => (

          <li key={i} role="none">
            <a
              role="menuitem"
              href={`#${nav}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(nav)
                onClose()            // 클릭 후 패널 닫기
              }} >
              {nav}
            </a>
          </li>
        ))}

      </ul>
    </nav>
  )
}

export default Nav