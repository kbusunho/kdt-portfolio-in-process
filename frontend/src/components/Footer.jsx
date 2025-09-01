import React from 'react'
import footer from "../utils/footer"
import "./styles/Footer.scss"
import { FaGithub } from "react-icons/fa";   // GitHub
import { SiNotion } from "react-icons/si";   // Notion (simple-icons 제공)
const Footer = () => {
  return (
    <footer className="Footer">
      <div className="inner">
        <div className="left">
          {/* <img src={footer.brand.logo} alt={footer.brand.name} className="logo" /> */}
          <h2>{footer.brand.name}</h2>
          <p>{footer.brand.copy}</p>
        </div>
        <nav className="links">
          <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
            <FaGithub size={28}/>
          </a>
          <a href="https://notion.site" target="_blank" rel="noopener noreferrer">
            <SiNotion size={28} />
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer