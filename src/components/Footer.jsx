const Footer = () => {
  return (
    <footer className="bg-bk-2 border-t border-bk-3 text-wt-2 text-sm px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold">autoflux</span>. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
