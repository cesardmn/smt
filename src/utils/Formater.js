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

    const EXTRA_COLUMN_MAX_LENGTH = 100

    const ensureAllColumns = (row) => {
      const fullRow = { ...row }
      for (const col of REQUIRED_COLUMNS) {
        if (!(col in fullRow)) {
          fullRow[col] = ''
        }
      }
      return fullRow
    }

    const normalizeRowKeys = (row) => {
      return Object.keys(row).reduce((acc, key) => {
        if (key === '__rowNum__') return acc
        const normalizedKey = normalizeString(sanitizeString(key), true)
        const rawValue = row[key]
        const sanitizedValue = sanitizeString(rawValue)
        const normalizedValue = normalizeString(sanitizedValue, false)
        acc[normalizedKey] = normalizedValue
        return acc
      }, {})
    }

    const validateRequiredColumns = (headers) => {
      const normalizedHeaders = headers.map((header) =>
        normalizeString(sanitizeString(header), true)
      )

      const missing = REQUIRED_COLUMNS.filter(
        (col) => !normalizedHeaders.includes(col)
      )

      const extraColumns = normalizedHeaders.filter(
        (col) => !REQUIRED_COLUMNS.includes(col)
      )

      const duplicateExtras = extraColumns.filter(
        (item, idx) => extraColumns.indexOf(item) !== idx
      )

      if (duplicateExtras.length > 0) {
        return {
          missing,
          error: `Colunas extras duplicadas detectadas: ${duplicateExtras.join(', ')}`,
        }
      }

      return { missing, error: null }
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

      // Verificar restrições dos campos definidos
      for (const [field, constraints] of Object.entries(FIELD_CONSTRAINTS)) {
        if (!(field in row)) continue

        let value = String(row[field] ?? '')

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

        if (field === 'cep' && value.length !== 8) {
          errors.push(`CEP com comprimento inválido: ${value}`)
        }
      }

      // Validação de colunas extras
      for (const key of Object.keys(row)) {
        if (
          !REQUIRED_COLUMNS.includes(key) &&
          key !== 'row' &&
          !key.startsWith('__')
        ) {
          const value = String(row[key] ?? '')
          if (value.length > EXTRA_COLUMN_MAX_LENGTH) {
            errors.push(
              `Campo extra "${key}" excede ${EXTRA_COLUMN_MAX_LENGTH} caracteres`
            )
          }
        }
      }

      return errors.length === 0 ? null : errors
    }

    // 3. Verificar colunas obrigatórias e erros de duplicidade
    const { missing, error: columnError } = validateRequiredColumns(headers)
    if (missing.length > 0 || columnError) {
      return {
        status: 'nok',
        message: [
          missing.length > 0
            ? `Colunas obrigatórias ausentes: ${missing.join(' | ')}`
            : null,
          columnError,
        ]
          .filter(Boolean)
          .join(' | '),
        dataValid: [],
        dataInvalid: [],
      }
    }

    // 4. Normalizar e validar dados
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
          errors: validationErrors.join(' | '),
        })
      } else {
        result.dataValid.push(row)
      }
    }

    // 5. Validar os CEPs
    const uniqueCeps = [
      ...new Set(result.dataValid.map((row) => row['cep']).filter(Boolean)),
    ]
    const cepValidation = await CepValidator(uniqueCeps)

    const invalidCeps = cepValidation
      .filter((res) => res.valid === false)
      .map((res) => res.cep)

    if (invalidCeps.length > 0) {
      const invalidCepsSet = new Set(invalidCeps)
      result.dataValid = result.dataValid.filter((row) => {
        if (invalidCepsSet.has(row['cep'])) {
          const completeRow = ensureAllColumns(row)
          result.dataInvalid.push({
            ...completeRow,
            errors: 'CEP inválido',
          })
          return false
        }
        return true
      })
    }

    // 6. Retorno final
    return {
      status: 'ok',
      message: `Processadas ${result.dataValid.length} linhas válidas e ${result.dataInvalid.length} inválidas`,
      ...result,
      ceps: cepValidation,
      REQUIRED_COLUMNS,
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
