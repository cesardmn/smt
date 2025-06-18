import { Xlsx } from './Xlsx'
import { normalizeString, sanitizeString, CepValidator } from '../utils/index'

export const Formater = async (file) => {
  try {
    // 1. Ler e analisar o arquivo XLSX
    const { status, message, headers, data } = await Xlsx.readerXLSX(file)
    if (status === 'nok') {
      return { status, message, dataValid: [], dataInvalid: [] }
    }

    // 2. Constantes de configuração
    const REQUIRED_COLUMNS = [
      'titulo/outros',
      'nome completo',
      'e-mail',
      'ddd',
      'telefone',
      'cpf_cnpj',
      'cep',
      'tipo logradouro',
      'logradouro',
      'bairro',
      'cidade',
      'uf',
      'tipo de endereco',
      'complemento',
      'numero',
    ]

    const REQUIRED_FIELDS = ['nome completo', 'cep', 'numero']

    const FIELD_CONSTRAINTS = {
      numero: { maxLength: 8, numeric: true },
      'titulo/outros': { maxLength: 40 },
      complemento: { maxLength: 40 },
      'nome completo': { maxLength: 60 },
      'e-mail': { maxLength: 50 },
      'tipo logradouro': { maxLength: 72 },
      logradouro: { maxLength: 72 },
      bairro: { maxLength: 72 },
      cidade: { maxLength: 72 },
      uf: { maxLength: 2, uppercase: true },
      'tipo de endereco': {
        maxLength: 1,
        allowedValues: ['I', 'N'],
        defaultValue: 'N',
      },
      ddd: { maxLength: 3, numeric: true },
      telefone: { maxLength: 10, numeric: true },
      cpf_cnpj: { maxLength: 14, numeric: true },
      cep: { maxLength: 8, numeric: true, padStart: true },
    }

    const ensureAllColumns = (row) => {
      const fullRow = { ...row }
      for (const col of REQUIRED_COLUMNS) {
        if (!(col in fullRow)) {
          fullRow[col] = ''
        }
      }
      return fullRow
    }

    // 3. Funções auxiliares
    const normalizeRowKeys = (row) => {
      return Object.keys(row).reduce(
        (acc, key) => {
          if (key === '__rowNum__') return acc
          const normalizedKey = normalizeString(sanitizeString(key), true)
          const rawValue = row[key]
          const sanitizedValue = sanitizeString(rawValue)
          const normalizedValue = normalizeString(sanitizedValue, false)
          acc[normalizedKey] = normalizedValue
          return acc
        },
        { row: row.__rowNum__ != null ? row.__rowNum__ + 1 : null }
      )
    }

    const validateRequiredColumns = (headers) => {
      const normalizedHeaders = headers.map((header) =>
        normalizeString(sanitizeString(header), true)
      )
      return REQUIRED_COLUMNS.filter((col) => !normalizedHeaders.includes(col))
    }

    const validateRow = (row) => {
      const errors = []

      // Verificar campos obrigatórios
      for (const field of REQUIRED_FIELDS) {
        const value = row[field]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(`Campo obrigatório ausente: ${field}`)
        }
      }

      // Verificar restrições dos campos
      for (const [field, constraints] of Object.entries(FIELD_CONSTRAINTS)) {
        if (!(field in row)) continue

        let value = String(row[field] ?? '')

        // Tratamento especial para o campo 'numero'
        if (field === 'numero') {
          const rawNumero = value.toLowerCase()
          if (!rawNumero || ['s/n', 'sn'].includes(rawNumero)) {
            row['numero'] = '0'
            const comp = row['complemento'] || ''
            const hasSN = comp.toLowerCase().includes('s/n')
            row['complemento'] = (hasSN ? comp : `s/n ${comp}`)
              .trim()
              .slice(0, FIELD_CONSTRAINTS['complemento'].maxLength)
            continue
          }
        }

        if (constraints.numeric) {
          value = value.replace(/\D/g, '')
          if (value.length === 0 && REQUIRED_FIELDS.includes(field)) {
            errors.push(`Valor numérico inválido para o campo: ${field}`)
          }
        }

        if (constraints.uppercase) {
          value = value.toUpperCase()
        }

        if (constraints.allowedValues) {
          const upperVal = value.toUpperCase()
          value = constraints.allowedValues.includes(upperVal)
            ? upperVal
            : constraints.defaultValue
        }

        if (constraints.padStart) {
          value = value.padStart(constraints.maxLength, '0')
        }

        value = value.slice(0, constraints.maxLength)
        row[field] = value

        // Validação adicional de CEP
        if (field === 'cep' && value.length !== 8) {
          errors.push(`CEP com comprimento inválido: ${value}`)
        }
      }

      return errors.length === 0 ? null : errors
    }

    // 4. Processamento principal
    // Verificar colunas obrigatórias ausentes
    const missingColumns = validateRequiredColumns(headers)
    if (missingColumns.length > 0) {
      return {
        status: 'nok',
        message: `Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`,
        dataValid: [],
        dataInvalid: [],
      }
    }

    // Normalizar e validar dados
    const result = {
      dataValid: [],
      dataInvalid: [],
    }

    for (const originalRow of data) {
      const row = normalizeRowKeys(originalRow)
      const validationErrors = validateRow(row)

      if (validationErrors) {
        const completeRow = ensureAllColumns(row)
        result.dataInvalid.push({
          ...completeRow,
          __errors: validationErrors,
          __row: row.row,
        })
      } else {
        result.dataValid.push(row)
      }
    }

    // Validar os CEPs
    const uniqueCeps = [
      ...new Set(result.dataValid.map((row) => row['cep']).filter(Boolean)),
    ]
    const cepValidation = await CepValidator(uniqueCeps)

    // Validar CEPs nos dados válidos
    const invalidCeps = cepValidation
      .filter((res) => res.valid === false)
      .map((res) => res.cep)

    if (invalidCeps.length > 0) {
      const invalidCepsSet = new Set(invalidCeps)
      // Mover linhas com CEP inválido para inválidas
      result.dataValid = result.dataValid.filter((row) => {
        if (invalidCepsSet.has(row['cep'])) {
          const completeRow = ensureAllColumns(row)
          result.dataInvalid.push({
            ...completeRow,
            __errors: ['CEP inválido'],
            __row: row.row,
          })
          return false
        }
        return true
      })
    }

    return {
      status: 'ok',
      message: `Processadas ${result.dataValid.length} linhas válidas e ${result.dataInvalid.length} inválidas`,
      ...result,
      ceps: cepValidation,
    }
  } catch (error) {
    console.error('Erro no Formater:', error)
    return {
      status: 'nok',
      message: 'Ocorreu um erro inesperado durante o processamento',
      dataValid: [],
      dataInvalid: [],
      ceps: null,
    }
  }
}
