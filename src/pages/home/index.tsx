import {memo} from "react"
import './index.scss'
import {useNavigate} from "react-router-dom"

export default memo(() => {
  let navigate = useNavigate()

  return (
    <div className={'home'}>
      <header>
        <div className="logo">
          Open Design
        </div>
        <div className="options">
          <div className="start" onClick={() => navigate('/design')}>
            开始使用
          </div>
        </div>
      </header>
      <main>
        <section className={'one'}>
          <div className="desc">
            <div className="t1">
              在线 UI/UX 设计工具
            </div>
            <div className="t2">
              <span className={'color'}>代码开源、可私有化部署</span>
            </div>
          </div>
          <img
            src="https://cdn.sanity.io/images/599r6htc/localized/455e29e0d05e64300b4a2aa99bcd25fa10a341a7-6969x2010.png?w=2016&q=75&fit=max&auto=format&dpr=1.5"
            alt=""/>
        </section>
      </main>
    </div>
  )
})