import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function downloadPDF(element, filename, title = '') {
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#edf0f8',
    logging: false,
  })

  const A4_W_MM  = 210
  const A4_H_MM  = 297
  const MARGIN   = 10
  const HEADER   = title ? 18 : 0  // mm reserved for title on first page

  const usableW  = A4_W_MM - MARGIN * 2
  const scaleRatio  = usableW / canvas.width            // mm per canvas-px
  const scaledFullH = canvas.height * scaleRatio        // total image height in mm

  // How many canvas pixels fit on one page (accounting for header on p1)
  const pageBodyH_px = (A4_H_MM - MARGIN * 2 - HEADER) / scaleRatio
  const pageBodyH_px2 = (A4_H_MM - MARGIN * 2) / scaleRatio

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })

  let srcY = 0       // current canvas pixel offset
  let pageNum = 0

  while (srcY < canvas.height) {
    if (pageNum > 0) pdf.addPage()

    const headerH = pageNum === 0 ? HEADER : 0
    const bodyY   = MARGIN + headerH               // mm from top where image starts
    const slicePx = Math.min(
      pageNum === 0 ? pageBodyH_px : pageBodyH_px2,
      canvas.height - srcY
    )

    // Draw header on first page
    if (pageNum === 0 && title) {
      pdf.setFontSize(13)
      pdf.setTextColor(30, 42, 90)
      pdf.text(title, MARGIN, MARGIN + 6)
      pdf.setFontSize(8)
      pdf.setTextColor(130, 130, 150)
      pdf.text(
        `Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        MARGIN, MARGIN + 12
      )
    }

    // Slice the canvas for this page
    const slice = document.createElement('canvas')
    slice.width  = canvas.width
    slice.height = Math.ceil(slicePx)
    slice.getContext('2d').drawImage(
      canvas,
      0, Math.floor(srcY),
      canvas.width, Math.ceil(slicePx),
      0, 0,
      canvas.width, Math.ceil(slicePx)
    )

    const sliceH_mm = slicePx * scaleRatio
    pdf.addImage(slice.toDataURL('image/png'), 'PNG', MARGIN, bodyY, usableW, sliceH_mm)

    srcY += slicePx
    pageNum++
  }

  pdf.save(`${filename}.pdf`)
}
