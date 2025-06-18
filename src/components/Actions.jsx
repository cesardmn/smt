import { useState } from 'react'
import { useFileProcessor } from '../hooks/useFileProcessor'
import { FileUploader } from './FileUploader'
import { LogViewer } from './LogViewer'
import { DownloadButton } from './DownloadButton'

export const Actions = () => {
  const [dragActive, setDragActive] = useState(false)
  const { log, loading, downloadData, processFile, triggerDownload } =
    useFileProcessor()

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const handleDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(event.type === 'dragenter' || event.type === 'dragover')
  }

  const handleDownloadClick = () => {
    if (downloadData) {
      triggerDownload(downloadData.blob, downloadData.name)
    }
  }

  return (
    <section className="w-full h-[75svh] bg-bk-2 text-wt-1 p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-scroll">
      <FileUploader
        onFileChange={handleFileChange}
        onDrag={handleDrag}
        dragActive={dragActive}
      />

      <div className="w-full text-left bg-bk-1 text-gr-2 p-6 rounded-lg shadow-md">
        <LogViewer logs={log} loading={loading} />
      </div>

      {downloadData && <DownloadButton onClick={handleDownloadClick} />}
    </section>
  )
}

export default Actions
