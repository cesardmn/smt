import { useState } from 'react'
import logo from '../assets/img/htd.svg'
import { BsLinkedin, BsGithub } from 'react-icons/bs'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="bg-bk-2 border-b border-bk-3 text-wt-1"
      aria-label="Barra de navegação principal"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavbarLogo />

        <MobileToggleButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <NavbarLinks className="hidden md:flex gap-6" />
      </div>

      {menuOpen && <NavbarLinks className="md:hidden px-4 pb-4 space-y-2" />}
    </nav>
  )
}

const NavbarLogo = () => (
  <div className="flex items-center gap-3">
    <a
      href="https://autoflux.app.br/"
      className="hover:text-or-1 cursor-pointer"
      aria-label="Site do AutoFlux"
    >
      {' '}
      <div className="h-10 w-auto overflow-hidden flex items-center justify-center text-bk-1 font-bold text-lg select-none">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>
    </a>
  </div>
)

const NavbarLinks = ({ className = '' }) => (
  <ul
    className={`${className} text-gr-2 font-medium flex items-center`}
    role="menu"
  >
    <li>
      <a
        href="https://github.com/cesardmn/smt"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-or-1 cursor-pointer"
        aria-label="GitHub"
      >
        <BsGithub />
      </a>
    </li>

    <li>
      <a
        href="https://linkedin.com/in/cesardmn"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-or-1 cursor-pointer"
        aria-label="LinkedIn"
      >
        <BsLinkedin />
      </a>
    </li>
  </ul>
)

const MobileToggleButton = ({ menuOpen, setMenuOpen }) => (
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden focus:outline-none focus:ring-2 focus:ring-or-2"
    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
  >
    <svg
      className="w-6 h-6 text-wt-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
      />
    </svg>
  </button>
)

export default Navbar
