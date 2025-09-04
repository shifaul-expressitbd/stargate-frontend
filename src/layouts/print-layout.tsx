import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'

export default function PrintLayout() {
  const [searchParams] = useSearchParams()
  const [isReadyToPrint, setIsReadyToPrint] = useState(false)
  const navigate = useNavigate()
  const paperType = searchParams.get('paper') || 'A4' // Default to A4 if not specified

  useEffect(() => {
    if (searchParams.get('print') !== 'true') return

    const style = document.createElement('style')

    if (paperType === '4x6') {
      style.innerHTML = `
        @page { size: 4in 6in; margin: 0; }
        @media print {
          body { margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-content { width: 4in; height: 6in; background-color: white !important; margin: 0 auto; page-break-after: always; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `;
    } else {
      // Default A4 styling
      style.innerHTML = `
        @page { size: A4; margin: 0; }
        @media print {
          body { margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-content { width: 210mm; min-height: 297mm; background-color: white !important; margin: 0 auto; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `;
    }

    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [searchParams, paperType])

  useEffect(() => {
    if (!isReadyToPrint || searchParams.get('print') !== 'true') return

    const printTimeout = setTimeout(() => {
      window.print()

      // Navigate back after printing (with a delay to ensure print completes)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }, 500)

    return () => {
      clearTimeout(printTimeout)
    }
  }, [isReadyToPrint, searchParams, navigate])

  return (
    <div className={`print-content ${paperType === '4x6' ? 'label-size' : ''}`}>
      <Outlet context={{ setIsReadyToPrint, paperType }} />
    </div>
  )
}