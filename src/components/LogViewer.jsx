export const LogViewer = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="w-full text-left bg-bk-1 text-gr-2 p-6 rounded-lg shadow-md">
        <span className="animate-pulse">⏳ Processando...</span>
      </div>
    )
  }

  return (
    <>
      {logs.length > 0 && (
        <div className="w-full text-left bg-bk-1 text-gr-2 p-6 rounded-lg shadow-md">
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
        </div>
      )}
    </>
  )
}
