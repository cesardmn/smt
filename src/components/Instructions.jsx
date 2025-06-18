import {
  FaClock,
  FaCog,
  FaCheck,
  FaBookOpen,
  FaDownload,
  FaEdit,
  FaUpload,
  FaQuestionCircle,
  FaFileExcel,
} from 'react-icons/fa'

const Hero = () => {
  return (
    <div className="bg-bk-1 p-6 rounded-lg border-l-4 border-or-1 shadow-lg mb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-orange mb-6">
        SMT - Formater
      </h1>
      <p className="text-lg leading-relaxed text-wt-2">
        Transforme sua planilha em um arquivo CSV perfeito para o Sistema de
        Mensagens Telemáticas dos Correios.
      </p>
      <div className="mt-4 flex items-center space-x-2 text-sm text-or-1">
        <FaClock />
        <span>Processamento rápido e sem complicações</span>
      </div>
    </div>
  )
}

const Features = () => {
  const features = [
    {
      title: 'Formatação automática',
      text: 'Padronização dos dados conforme requisitos dos Correios.',
    },
    {
      title: 'Validação avançada',
      text: 'CEPs inválidos são identificados e listados para correção.',
    },
    {
      title: 'Limite inteligente',
      text: 'Planilhas com mais de 200 registros são automaticamente fracionadas.',
    },
  ]

  return (
    <div className="bg-bk-1 p-6 rounded-lg border-r-4 border-or-1 shadow-lg mb-6">
      <h3 className="text-xl font-semibold text-wt-1 mb-3 flex items-center gap-2">
        <FaCog className="text-or-1" />
        Main Features
      </h3>
      <ul className="space-y-3">
        {features.map(({ title, text }, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="bg-or-1/20 p-1 rounded-full mt-0.5">
              <FaCheck className="text-or-1 text-xs" />
            </div>
            <div>
              <strong className="text-wt-1">{title}:</strong>
              <span className="text-gr-1"> {text}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const TemplateDownload = () => {
  return (
    <a
      href="docs/template_modelo_smt.xlsx"
      download
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-or-2 to-or-3 text-wt-1 rounded-md hover:from-or-2 hover:to-or-4 transition-all duration-200 shadow-md hover:shadow-lg mt-8"
    >
      <FaDownload />
      <span>Baixar Modelo (.XLSX)</span>
    </a>
  )
}

const Step = ({ step, Icon, title, text, extras }) => (
  <div className="flex gap-4 bg-bk-1 p-4 border-bk-3 rounded-lg shadow-xl hover:border-or-1 transition-colors">
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold bg-gradient-to-r from-or-1 to-or-3 text-wt-1">
      {step}
    </div>
    <div>
      <h4 className="font-semibold text-wt-1 mb-1 flex items-center gap-2">
        {Icon}
        {title}
      </h4>
      <p className="text-sm text-gr-1">{text}</p>
      {extras?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {extras.map((item, idx) => (
            <span
              key={idx}
              className="text-xs bg-or-1/10 text-or-2 px-2 py-1 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {step === '1' && <TemplateDownload />}
    </div>
  </div>
)

const HowToUse = () => {
  const steps = [
    {
      step: '1',
      Icon: <FaDownload className="text-or-2/60" />,
      title: 'Baixe a planilha modelo',
      text: 'Comece com nosso template pré-formatado contendo todos os campos necessários:',
      extras: ['Nome Completo', 'CEP', 'Número'],
    },
    {
      step: '2',
      Icon: <FaEdit className="text-or-2/60" />,
      title: 'Preencha os dados',
      text: 'Adicione suas informações. Você pode incluir campos opcionais como:',
      extras: ['Departamento', 'Código Interno', 'Telefone'],
    },
    {
      step: '3',
      Icon: <FaUpload className="text-or-2/60" />,
      title: 'Envie a planilha',
      text: `Arraste o arquivo para a área designada ou clique para selecionar. Nosso sistema fará todo o processamento automaticamente.`,
      extras: ['Formato suportado: .xlsx'],
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-wt-1 flex items-center gap-2">
        <FaBookOpen className="text-or-1" />
        Como Usar
      </h3>

      {steps.map((props, i) => (
        <Step key={i} {...props} />
      ))}
    </div>
  )
}

const Help = () => {
  return (
    <div className="w-full flex border-t border-gr-3 mt-4">
      <p className="w-full flex justify-center items-center text-gr-2 gap-2 pt-8 text-sm">
        <FaQuestionCircle />
        Em caso de dúvidas
        <a
          href="docs/02_Manual_do_Usuário_-_SMT_2.27_-_Telegrama.pdf"
          className="text-or-1 hover:underline"
        >
          consulte o manual.
        </a>
      </p>
    </div>
  )
}

const Instructions = () => {
  return (
    <section className="w-full h-[75svh] bg-bk-2 text-wt-1 p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-scroll">
      <Hero />
      <Features />
      <HowToUse />
      <Help />
    </section>
  )
}

export default Instructions
