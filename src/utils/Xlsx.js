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
        message: `Erro ao processar arquivo. ${error.message}`,
      }
    }
  }

  const writeXLSX = (data = [], filename = 'arquivo.xlsx') => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return {
          status: 'nok',
          message: 'Dados inválidos para exportação',
          file: null,
        }
      }

      const worksheet = xlsx.utils.json_to_sheet(data)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Planilha1')

      const wbout = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      return {
        status: 'ok',
        message: `Arquivo XLSX "${filename}" gerado com sucesso.`,
        file: blob,
      }
    } catch (error) {
      return {
        status: 'nok',
        message: `Erro ao gerar arquivo XLSX: ${error.message}`,
        file: null,
      }
    }
  }

  return {
    readerXLSX,
    writeXLSX,
  }
})()
