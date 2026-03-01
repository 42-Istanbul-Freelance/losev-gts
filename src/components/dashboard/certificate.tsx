"use client"

import { useRef, useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"
import { Download, Award, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface CertificateProps {
  studentName: string
  hours: number
  issueDate?: Date
}

export function Certificate({ studentName, hours, issueDate = new Date() }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    setIsGenerating(true)
    try {
      // Create canvas from DOM element
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // higher scale for better quality
        backgroundColor: "#ffffff",
        logging: false,
      })

      // Calculate PDF dimensions (A4 Landscape)
      const imgWidth = 297 // A4 width in mm
      const pageHeight = 210 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF("l", "mm", "a4")
      const imgData = canvas.toDataURL("image/png")
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`LOSEV_Gonulluluk_Sertifikasi_${studentName.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error("Sertifika oluşturulurken hata:", error)
      alert("Sertifika indirilirken bir sorun oluştu.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full justify-between items-center sm:px-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dijital Sertifikanız</h2>
          <p className="text-gray-500 text-sm">Bu belge LÖSEV gönüllülük çalışmalarınızın resmi karşılığıdır.</p>
        </div>
        <Button 
          onClick={downloadCertificate} 
          disabled={isGenerating}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          PDF Olarak İndir
        </Button>
      </div>

      <div className="w-full max-w-[900px] overflow-x-auto pb-4 custom-scrollbar">
        {/* CERTIFICATE DOM ELEMENT */}
        <div 
          ref={certificateRef}
          className="relative min-w-[800px] w-full aspect-[1.414/1] bg-white text-center flex flex-col items-center justify-center p-12 overflow-hidden shadow-xl"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            border: "20px solid #cbd5e1",
            boxSizing: "border-box"
          }}
        >
          {/* Inner Border */}
          <div className="absolute inset-4 border-2 border-slate-300 border-dashed opacity-50 pointer-events-none" />

          {/* LÖSEV Logo Area Placeholder */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-200">
              <span className="text-orange-600 font-black text-2xl tracking-tighter">LÖSEV</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-slate-800 tracking-wider mb-2 uppercase">
            Gönüllülük Sertifikası
          </h1>
          <div className="w-32 h-1 bg-orange-500 mx-auto mb-10" />

          <p className="text-xl text-slate-600 italic mb-6">
            Bu belge, üstün gayret ve desteklerinden ötürü,
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6 capitalize decoration-slate-300 underline-offset-8">
            {studentName}
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-12">
            isimli öğrencimize, LÖSEV (Lösemili Çocuklar Sağlık ve Eğitim Vakfı) projelerinde göstermiş olduğu 
            <strong className="text-slate-800 mx-2">{hours} saatlik</strong> 
            karşılıksız gönüllü faaliyetlerden dolayı takdim edilmiştir. Varlığınızla çocuklara umut oldunuz.
          </p>

          <div className="flex w-full justify-between items-end px-16 mt-auto">
            <div className="text-center">
              <div className="w-40 border-b border-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">Tarih</p>
              <p className="text-sm text-slate-500">{format(issueDate, "dd MMMM yyyy", { locale: tr })}</p>
            </div>
            
            <div className="w-24 h-24 flex items-center justify-center opacity-80">
              <Award className="w-20 h-20 text-yellow-500 drop-shadow-md" />
            </div>

            <div className="text-center">
              <div className="w-40 border-b border-slate-400 mb-2 mt-8" />
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">LÖSEV Yönetim</p>
              <p className="text-sm text-slate-500">Genel Koordinatörlük</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
