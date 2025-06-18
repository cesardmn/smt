export const CsvGenerator = async (data, REQUIRED_COLUMNS) => {
  try {
    if (!Array.isArray(data)) {
      return {
        status: 'nok',
        message: 'Data deve ser um array',
        csvFiles: [],
      }
    }

    if (!Array.isArray(REQUIRED_COLUMNS)) {
      return {
        status: 'nok',
        message: 'REQUIRED_COLUMNS deve ser um array',
        csvFiles: [],
      }
    }

    const MAX_LINES = 200

    const encodeCsvLine = (item) => {
      return Object.entries(item)
        .map(([key, value]) =>
          REQUIRED_COLUMNS.includes(key) ? `${value}` : `${key}:${value}`
        )
        .join(';')
    }

    const allLines = data.map(encodeCsvLine)
    const chunks = []

    for (let i = 0; i < allLines.length; i += MAX_LINES) {
      const chunkLines = allLines.slice(i, i + MAX_LINES)
      const content = chunkLines.join('\n')
      const filename = `dados_validos_parte_${chunks.length + 1}.csv`
      const blob = new Blob([content], { type: 'text/csv' })
      chunks.push({ name: filename, blob })
    }

    return {
      status: 'ok',
      message: `Gerado ${chunks.length} arquivo(s) CSV`,
      csvFiles: chunks,
    }
  } catch (error) {
    return {
      status: 'nok',
      message: `Erro ao gerar CSV: ${error.message}`,
      csvFiles: [],
    }
  }
}
