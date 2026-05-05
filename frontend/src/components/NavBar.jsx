import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { label: 'HOME', href: '/' },
  { label: 'DASHBOARD', href: '/dashboard' },
  { label: 'CHAT', href: '/chat' },
  { label: 'ANALYTICS', href: '/analytics' },
  { label: 'SETTINGS', href: '/settings' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, logout } = useAuth()

  return (
    <header className="site-header w-full bg-cream border-b-2 border-mint">
      <div className="site-header-inner w-full">
        <Link to="/" className="logo">
          <span>Music </span>
          <span className="logo-rx">Therapy</span>
        </Link>

        <nav className="site-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`nav-link transition-colors duration-200 ${isActive ? 'text-mint-500 border-b-2 border-mint-500 pb-1' : 'hover:text-mint-400'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {token ? (
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="cta-button btn-outline"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link to="/login" className="cta-button btn-solid transition-all duration-300 ease-in-out hover:scale-[1.02]">
            GET STARTED
          </Link>
        )}
      </div>
    </header>
  )
}
