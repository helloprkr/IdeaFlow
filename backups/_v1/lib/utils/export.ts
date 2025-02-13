export function exportToCSV(data: any) {
  if (!data) return

  const headers = Object.keys(data).join(',')
  const values = Object.values(data).join(',')
  const csv = `${headers}\n${values}`
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  link.href = url
  link.setAttribute('download', `analytics-${new Date().toISOString()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}