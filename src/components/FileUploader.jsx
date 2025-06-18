import { FaRegFileExcel } from 'react-icons/fa6'

export const FileUploader = ({ onFileChange, dragActive, onDrag }) => {
  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onDrag(event) // Isso vai definir dragActive como false
    if (event.dataTransfer?.files?.length) {
      onFileChange({ target: { files: event.dataTransfer.files } })
    }
  }

  return (
    <div className="bg-bk-1 p-6 rounded-lg shadow-md">
      <label
        htmlFor="xlsx"
        role="button"
        aria-label="Selecione ou arraste um arquivo"
        tabIndex="0"
        onDrop={handleDrop}
        onDragOver={onDrag}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${dragActive ? 'bg-of-green-2/20 border-of-green-3' : 'border-of-green-4 hover:bg-of-green-2/5'}`}
      >
        <FaRegFileExcel className="mx-auto text-of-green-4 text-4xl mb-3" />
        <p className="font-medium">
          Arraste sua planilha ou clique para enviar
        </p>
        <p className="text-sm text-gr-1 mt-2">Formato aceito: .xlsx</p>
      </label>

      <input
        id="xlsx"
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  )
}
