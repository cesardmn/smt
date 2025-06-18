import PizZip from 'pizzip'

export const isValidFile = (file, type) => {
  if (!file || !file.name) return false
  const fileName = file.name.toLowerCase()
  const expectedExtension = type.toLowerCase()
  return fileName.endsWith(expectedExtension)
}

export const getBuffer = async (file, size) => {
  try {
    const buffer = await file.arrayBuffer()

    if (buffer.byteLength === 0) {
      return { status: 'nok', message: 'O arquivo está vazio.', buffer: null }
    }

    const sizeMB = buffer.byteLength / (1024 * 1024)
    if (sizeMB > size) {
      return {
        status: 'nok',
        message: `O arquivo é muito grande (${sizeMB.toFixed(2)}MB). Máximo permitido: ${size}MB.`,
        buffer: null,
      }
    }

    return { status: 'ok', buffer }
  } catch (error) {
    return {
      status: 'nok',
      message: `Erro ao ler o arquivo: ${error.message || error}`,
      buffer: null,
    }
  }
}

export const getZip = (buffer) => {
  try {
    const zip = new PizZip(buffer)
    return { status: 'ok', zip }
  } catch (error) {
    return {
      status: 'nok',
      message: `Erro ao processar o arquivo ZIP: ${error.message || error}`,
      zip: null,
    }
  }
}

export const sanitizeString = (str) => {
  if (str == null) return ''

  str = String(str).trim()

  // Substitui tabulações por espaço
  str = str.replace(/\t+/g, ' ')

  // Substitui quebras de linha/carriage return por espaço
  str = str.replace(/[\r\n]+/g, ' ')

  // Remove caracteres de controle (códigos charCode 0–31)
  str = Array.from(str)
    .filter((char) => char.charCodeAt(0) > 31)
    .join('')

  // Remove caracteres Unicode invisíveis de forma individual (evita a class unida)
  const invisibleChars = [
    '\u200B',
    '\u200C',
    '\u200D',
    '\uFEFF',
    '\u202F',
    '\u00A0',
  ]
  invisibleChars.forEach((char) => {
    str = str.split(char).join('')
  })

  // Reduz múltiplos espaços para um
  str = str.replace(/\s+/g, ' ')

  return str.length === 0 || str === ' ' ? '' : str
}

export const findSanitizedDifferences = (arr) => {
  return arr
    .map((original, index) => {
      const sanitized = sanitizeString(original)
      return original !== sanitized ? { index, original, sanitized } : null
    })
    .filter((item) => item !== null)
}

export const normalizeString = (input, toLower = false) => {
  if (typeof input !== 'string') {
    input = String(input)
  }

  const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  return toLower ? normalized.toLowerCase() : normalized
}

export const CepValidator = async (cepSet) => {
  const fetchCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        return { cep, valid: false, error: 'CEP não encontrado' }
      }

      return { cep, valid: true, data }
    } catch (error) {
      return { cep, valid: false, error: error.message }
    }
  }

  const results = await Promise.all([...cepSet].map(fetchCep))
  return results
}
