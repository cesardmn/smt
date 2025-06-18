export const DownloadButton = ({ onClick }) => {
  return (
    <div className="w-full text-center">
      <button
        onClick={onClick}
        className="mt-4 px-6 py-2 bg-of-green-4 text-white rounded hover:bg-of-green-3 transition"
      >
        Baixar resultados
      </button>
    </div>
  )
}
