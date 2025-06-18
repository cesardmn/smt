import { useState } from 'react'
import JSZip from 'jszip'
import { Formater } from '../utils/Formater'
import { isValidFile } from '../utils/index'
import { CsvGenerator } from '../utils/CsvGenerator'
import { Xlsx } from '../utils/Xlsx'

export const useFileProcessor = () => {
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloadData, setDownloadData] = useState(null)

  const triggerDownload = (blob, filename) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const processFile = async (file) => {
    if (!isValidFile(file, 'xlsx')) {
      addLog('⚠️ Arquivo inválido ou inexistente. Selecione um .xlsx válido.')
      return false
    }

    try {
      setLoading(true)
      setDownloadData(null)
      setLog([])

      const formater = await Formater(file)
      const { dataValid, REQUIRED_COLUMNS, dataInvalid, message } = formater

      const filesToDownload = []

      // Process valid data
      if (dataValid.length > 0) {
        const csvResult = await CsvGenerator(dataValid, REQUIRED_COLUMNS)
        if (csvResult.status === 'ok' && csvResult.csvFiles.length > 0) {
          csvResult.csvFiles.forEach(({ name, blob }) => {
            filesToDownload.push({ name, blob })
          })
          addLog(`${csvResult.csvFiles.length} arquivo(s) CSV gerado(s).`)
        }
      }

      // Process invalid data
      if (dataInvalid.length > 0) {
        const xlsxResult = Xlsx.writeXLSX(dataInvalid, 'dados_invalidos.xlsx')
        if (xlsxResult.status === 'ok' && xlsxResult.file) {
          filesToDownload.push({
            name: 'dados_invalidos.xlsx',
            blob: xlsxResult.file,
          })
          addLog('Arquivo de dados inválidos gerado.')
        }
      }

      // Handle results
      if (filesToDownload.length === 0) {
        addLog(`⚠️ ${message}`)
      } else if (filesToDownload.length === 1) {
        const { name, blob } = filesToDownload[0]
        setDownloadData({ blob, name })
        addLog('Processamento concluído: arquivo único gerado.')
      } else {
        const zip = await createZip(filesToDownload)
        setDownloadData({ blob: zip, name: 'resultado_processamento.zip' })
        addLog(
          `Processamento concluído: ${filesToDownload.length} arquivos gerados.`
        )
      }

      return true
    } catch (error) {
      addLog(`❌ Erro ao processar o arquivo: ${error.message || error}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  const addLog = (message) => {
    setLog((prevLog) => [...prevLog, { timestamp: new Date(), message }])
  }

  const createZip = async (files) => {
    const zip = new JSZip()
    files.forEach(({ name, blob }) => zip.file(name, blob))
    return await zip.generateAsync({ type: 'blob' })
  }

  return {
    log,
    loading,
    downloadData,
    processFile,
    triggerDownload,
    addLog,
  }
}
