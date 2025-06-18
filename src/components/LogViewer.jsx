export const LogViewer = ({ logs, loading }) => {
  if (loading) {
    return <span className="animate-pulse">⏳ Processando...</span>
  }

  if (logs.length === 0) {
    return <p>Ainda não há logs. Selecione um arquivo .xlsx para começar.</p>
  }

  return (
    <>
      {logs
        .slice()
        .reverse()
        .map((entry, index) => (
          <p key={index}>
            <span className="text-gr-1 text-xs mr-2">
              [{entry.timestamp.toLocaleTimeString()}]
            </span>
            {entry.message}
          </p>
        ))}
    </>
  )
}
