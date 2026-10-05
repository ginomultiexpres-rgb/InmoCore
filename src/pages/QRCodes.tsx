import { useState } from "react";

const PROPERTIES = [
  { id: 1, name: "Depa Miraflores", price: "S/ 950,000", scans: 23, img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format", slug: "depa-miraflores" },
  { id: 2, name: "Casa San Isidro", price: "S/ 1,800,000", scans: 18, img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&h=80&fit=crop&auto=format", slug: "casa-san-isidro" },
  { id: 3, name: "Depa Surco", price: "S/ 680,000", scans: 31, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&h=80&fit=crop&auto=format", slug: "depa-surco" },
];

function QRPattern({ size = 100, seed = 1 }: { size?: number; seed?: number }) {
  const cells = 21;
  const cellSize = size / cells;

  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) {
        const ir = r < 7 ? r : r - (cells - 7);
        const ic = c < 7 ? c : c - (cells - 7);
        const inOuter = ir === 0 || ir === 6 || ic === 0 || ic === 6;
        const inInner = ir >= 2 && ir <= 4 && ic >= 2 && ic <= 4;
        return inOuter || inInner ? 1 : 0;
      }
      return ((r * cells + c + seed) % 3 === 0 || (r + c + seed) % 5 === 0) ? 1 : 0;
    })
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#212121"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function QRCodes() {
  const [previewProp, setPreviewProp] = useState<typeof PROPERTIES[0] | null>(null);
  const [downloaded, setDownloaded] = useState<number | null>(null);

  const handleDownload = (id: number) => {
    setDownloaded(id);
    setTimeout(() => setDownloaded(null), 1500);
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-[24px] font-bold text-[#212121]">Códigos QR</h1>
        <p className="text-[14px] text-[#757575] mt-1">Genera QR codes para tu portafolio y propiedades individuales</p>
      </div>

      {/* Portfolio QR */}
      <div className="bg-white rounded-[12px] p-6 mb-6 flex items-center gap-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="shrink-0">
          <QRPattern size={140} seed={1} />
        </div>
        <div className="flex-1">
          <h2 className="text-[18px] font-bold text-[#212121] mb-2">QR del Portafolio Completo</h2>
          <p className="text-[13px] text-[#757575] mb-1">URL: <span className="text-[#1E88E5]">tuapp.com/juanperez</span></p>
          <p className="text-[13px] text-[#757575] mb-4">Este QR lleva a tu portafolio completo con todas tus propiedades</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload(0)}
              className="px-4 py-2 text-[13px] font-medium bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
            >
              {downloaded === 0 ? "✓ Descargado" : "Descargar PNG"}
            </button>
            <button className="px-4 py-2 text-[13px] font-medium border border-[#E0E0E0] rounded-lg text-[#212121] hover:bg-[#F5F7FA] transition-colors">
              Descargar PDF Cartel
            </button>
          </div>
        </div>
      </div>

      {/* Per property */}
      <div className="mb-5">
        <h3 className="text-[16px] font-semibold text-[#212121] mb-3">QR por Propiedad</h3>
        <div className="bg-white rounded-[12px] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          {PROPERTIES.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-4 p-4 ${i < PROPERTIES.length - 1 ? "border-b border-[#F5F7FA]" : ""}`}>
              <img src={p.img} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#212121]">{p.name} — {p.price}</p>
              </div>
              <button
                onClick={() => setPreviewProp(p)}
                className="shrink-0 hover:opacity-80 transition-opacity"
              >
                <QRPattern size={48} seed={p.id + 2} />
              </button>
              <div className="shrink-0 text-left">
                <p className="text-[11px] text-[#1E88E5]">tuapp.com/juanperez#{p.slug}</p>
                <p className="text-[11px] text-[#757575]">{p.scans} escaneos</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(p.id)}
                  className="px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:bg-[#F5F7FA] transition-colors"
                >
                  {downloaded === p.id ? "✓" : "Descargar PNG"}
                </button>
                <button className="px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:bg-[#F5F7FA] transition-colors">
                  Cartel PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className="px-6 py-2.5 text-[14px] font-medium border-2 border-[#4CAF50] text-[#4CAF50] rounded-full hover:bg-[#E8F5E9] transition-colors">
          + Generar QR para otra propiedad
        </button>
      </div>

      {/* Preview modal */}
      {previewProp && (
        <div className="fixed inset-0 bg-black/30 flex items-end justify-end p-6 z-50 pointer-events-none">
          <div className="bg-white rounded-2xl overflow-hidden pointer-events-auto" style={{ boxShadow: "0 20px 25px rgba(0,0,0,0.1)", width: 220 }}>
            <img src={previewProp.img.replace("w=80&h=80", "w=220&h=140")} alt={previewProp.name} className="w-full h-32 object-cover" />
            <div className="p-4 flex flex-col items-center gap-2">
              <QRPattern size={100} seed={previewProp.id + 2} />
              <p className="text-[12px] font-semibold text-[#212121] text-center">Escanea para ver más propiedades</p>
              <p className="text-[11px] text-[#757575] text-center">Contacto:</p>
              <p className="text-[10px] text-[#757575] text-center">juan@inmocore.pe | +51 1 234 5678</p>
            </div>
            <button onClick={() => setPreviewProp(null)} className="w-full py-2 text-[12px] text-[#757575] border-t border-[#E0E0E0] hover:bg-[#F5F7FA] transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
