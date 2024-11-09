'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedUrl(data.url)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CSV 파일 업로드</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2 block" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={!file}>
          업로드
        </button>
      </form>
      {uploadedUrl && (
        <div>
          <p>파일이 성공적으로 업로드되었습니다.</p>
          <p>URL: {uploadedUrl}</p>
        </div>
      )}
    </div>
  )
}