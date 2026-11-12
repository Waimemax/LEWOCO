import { getToken } from './api'

// Downloads a file from the API using the signed-in token
export async function downloadFile(path, fallbackName) {
  const response = await fetch(`/api${path}`, {
    headers: { Authorization: `Bearer ${getToken()}`, Accept: 'text/csv' },
  })

  if (!response.ok) {
    throw new Error(
      response.status === 403
        ? 'You do not have permission to download this report.'
        : 'The download failed. Please try again.',
    )
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const match = /filename="?([^";]+)"?/.exec(disposition)

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = match ? match[1] : fallbackName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
