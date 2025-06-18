import * as xlsx from 'xlsx'

export const Xlsx = (() => {
  const readerXLSX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = xlsx.read(arrayBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheets = workbook.SheetNames.length

      const rows = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        blankrows: false,
      })
      if (rows.length === 0)
        return { status: 'nok', message: 'Planilha não contém dados.' }

      const headers = rows[0]
      if (headers.length === 0)
        return { status: 'nok', message: 'Planilha não tem cabeçalho.' }

      const data = xlsx.utils.sheet_to_json(sheet, { blankrows: false })
      if (data.length === 0)
        return {
          status: 'nok',
          message: 'Planilha contém cabeçalho porém não tem dados.',
        }

      return {
        status: 'ok',
        message: 'Arquivo processado com sucesso',
        sheets,
        headers,
        data,
      }
    } catch (error) {
      return {
        status: 'nok',
        message: `Erro aoprocessar arquivo. ${error}`,
      }
    }
  }

  return {
    readerXLSX,
  }
})()
