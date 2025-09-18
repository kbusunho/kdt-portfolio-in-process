import React from 'react'
import works from '../../utils/works'
import "./styles/Work.scss"
const Work = () => {
  return (
    <div className='inner work-inner'>
      <h3 className='sub-tit-2'>works.</h3>
      <ul className="work-lst">
        {works.map((work) => (
          <li key={work.id}>
            <a href={work.links.notion} className='lst-t-wrap'>
              <h4 className="lst-tit">
                {work.title}
              </h4>
              <p className="lst-dsc">
                {work.description}
              </p>
              <div className="tags">
                {work.tags.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
            </a>
            <a href={work.links.demo} className="lst-img-wrap">
              <div
                className="bg"
                style={{ backgroundImage: `url(${work.thumbnail})` }}
              ></div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Work