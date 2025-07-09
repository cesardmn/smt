import { useState } from 'react'
import logo from '../assets/img/htd.svg'
import { BsLinkedin, BsGithub } from 'react-icons/bs'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="bg-bk-2 border-b border-bk-3 text-wt-1"
      role="navigation"
      aria-label="Barra de navegação principal"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        <NavLinks className="hidden md:flex gap-6" />

        <MenuToggle open={menuOpen} setOpen={setMenuOpen} />
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden px-4 pt-0 pb-4 transition-all duration-300 ease-in-out ${
          menuOpen
            ? 'opacity-100 max-h-96'
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <NavLinks className="flex flex-col gap-2" />
      </div>
    </nav>
  )
}

const Logo = () => (
  <a
    href="https://autoflux.app.br/"
    className="flex items-center gap-2 hover:text-or-1 transition"
    aria-label="Ir para o site do AutoFlux"
  >
    <div className="h-10 w-auto overflow-hidden flex items-center justify-center text-bk-1 font-bold text-lg select-none">
      <img
        src={logo}
        alt="Logo do AutoFlux"
        className="w-full h-full object-contain"
      />
    </div>
  </a>
)

const NavLinks = ({ className = '' }) => (
  <ul className={`text-gr-2 font-medium ${className}`} role="menu">
    <li>
      <a
        href="https://www.autoflux.app.br/comparadoc"
        className="hover:text-or-1 transition-colors duration-150"
      >
        compara doc
      </a>
    </li>
    <li>
      <a
        href="https://www.autoflux.app.br/maladireta"
        className="hover:text-or-1 transition-colors duration-150"
      >
        mala direta
      </a>
    </li>
    <li>
      <a
        href="https://www.vfipe.com.br/"
        className="hover:text-or-1 transition-colors duration-150"
      >
        vfipe
      </a>
    </li>
  </ul>
)

const MenuToggle = ({ open, setOpen }) => (
  <button
    onClick={() => setOpen(!open)}
    className="md:hidden focus:outline-none focus:ring-2 focus:ring-or-2 transition-transform duration-150"
    aria-label={open ? 'Fechar menu' : 'Abrir menu'}
    aria-expanded={open}
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
        d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
      />
    </svg>
  </button>
)

export default Navbar
