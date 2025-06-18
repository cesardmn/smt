import { useState } from 'react'
import { FaRegFileExcel } from 'react-icons/fa6'
import { Formater } from '../utils/Formater'
import { isValidFile } from '../utils/index'

const Actions = () => {
  const [dragActive, setDragActive] = useState(false)
  const [log, setLog] = useState(
    'Ainda não há logs. Selecione um arquivo .xlsx para começar.'
  )

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!isValidFile(file, 'xlsx'))
      return setLog(
        'Arquio inválido ou inexistente. Por favor, selecione um arquivo .xlsx válido.'
      )

    const formater = await Formater(file)
    console.log(formater)
    setLog(formater.message)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    const file = event.dataTransfer?.files?.[0]
    if (!file) return alert('Nenhum arquivo solto')
    handleFileChange({ target: { files: [file] } })
  }

  const handleDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  return (
    <section className="w-full h-[75svh] bg-bk-2 text-wt-1 p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-scroll">
      <div className="bg-bk-1 p-6 rounded-lg shadow-md">
        <label
          htmlFor="xlsx"
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
            ${dragActive ? 'bg-of-green-2/20 border-of-green-3' : 'border-of-green-4 hover:bg-of-green-2/5'}`}
        >
          <FaRegFileExcel className="mx-auto text-of-green-4 text-4xl mb-3" />
          <p className="font-medium">
            {'Arraste sua planilha aqui ou clique para selecionar'}
          </p>
          <p className="text-sm text-gr-1 mt-2">Formatos aceitos: .xlsx</p>
        </label>

        <input
          id="xlsx"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="w-full text-center bg-bk-1 text-gr-2 p-6 rounded-lg shadow-md">
        {log}
      </div>
    </section>
  )
}

export default Actions
