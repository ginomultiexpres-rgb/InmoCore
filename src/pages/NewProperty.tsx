import { useState } from "react";
import { Link, useNavigate } from "react-router";

const STEPS = ["1. Fotos", "2. Datos", "3. Detalles", "4. Publicar"];

export default function NewProperty() {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<(string | null)[]>([
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format",
    null,
    null,
  ]);
  const [data, setData] = useState({ title: "", price: "", type: "Departamento", operation: "Venta" });
  const [details, setDetails] = useState({ beds: "2", baths: "2", sqm: "85", description: "" });
  const navigate = useNavigate();

  const uploadedCount = photos.filter(Boolean).length;

  return (
    <div className="p-6 max-w-[800px]">
      {/* Breadcrumb */}
      <div className="text-[13px] text-[#757575] mb-4">
        <Link to="/properties" className="hover:text-[#1E88E5]">Mis Propiedades</Link>
        <span className="mx-2">›</span>
        <span className="text-[#212121] font-medium">Nueva</span>
      </div>

      {/* Title + Stepper */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold text-[#212121]">Nueva Propiedad</h1>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                i === step
                  ? "bg-[#1E88E5] text-white"
                  : i < step
                  ? "text-[#1E88E5] bg-[#E3F2FD]"
                  : "text-[#BDBDBD] bg-transparent"
              }`}
            >
              {i < step && <span>✓</span>}
              {s}
            </button>
          ))}
        </div>
      </div>

      {step === 0 && (
        <Step1Photos photos={photos} setPhotos={setPhotos} uploadedCount={uploadedCount} onNext={() => setStep(1)} />
      )}
      {step === 1 && (
        <Step2Data data={data} setData={setData} onBack={() => setStep(0)} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <Step3Details details={details} setDetails={setDetails} onBack={() => setStep(1)} onNext={() => setStep(3)} />
      )}
      {step === 3 && (
        <Step4Publish onBack={() => setStep(2)} onPublish={() => navigate("/properties")} />
      )}
    </div>
  );
}

function Step1Photos({ photos, setPhotos, uploadedCount, onNext }: {
  photos: (string | null)[];
  setPhotos: (p: (string | null)[]) => void;
  uploadedCount: number;
  onNext: () => void;
}) {
  const mockUpload = (index: number) => {
    const mockUrls = [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&auto=format",
    ];
    const updated = [...photos];
    updated[index] = mockUrls[index];
    setPhotos(updated);
  };
  const removePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-[22px] font-semibold text-[#212121]">Sube las 4 mejores fotos de la propiedad</h2>
        <p className="text-[14px] text-[#757575] mt-1">La primera foto será la imagen principal que verán los clientes.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-[#E0E0E0] bg-[#F5F7FA]">
            {photo ? (
              <>
                <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
                  <span className="text-[12px] font-semibold text-[#212121]">
                    {i === 0 ? "1 - Principal" : `${i + 1}`}
                  </span>
                </div>
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#757575] hover:text-[#F44336] transition-colors text-[14px] font-bold"
                >
                  ×
                </button>
              </>
            ) : (
              <button
                onClick={() => mockUpload(i)}
                className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-[#E3F2FD] transition-colors"
              >
                <svg className="w-8 h-8 text-[#BDBDBD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path d="M3 9l2.45-2.45A2 2 0 016.86 6H9l1-2h4l1 2h2.14a2 2 0 011.41.55L21 9v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" />
                </svg>
                <span className="text-[13px] text-[#757575]">Subir foto {i + 1}</span>
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="bg-[#E3F2FD] rounded-lg px-4 py-3 mb-5 text-[13px] text-[#1565C0]">
        💡 Tip: Usa fotos horizontales con buena iluminación. La foto principal es la que más impacta.
      </div>
      <div className="mb-5">
        <div className="flex justify-between text-[13px] mb-1.5">
          <span className="text-[#757575]">{uploadedCount} de 4 fotos subidas</span>
          <span className="text-[#1E88E5] font-medium">{Math.round((uploadedCount / 4) * 100)}%</span>
        </div>
        <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E88E5] rounded-full transition-all"
            style={{ width: `${(uploadedCount / 4) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Link to="/properties" className="flex-1 py-3 text-center text-[14px] font-medium border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#F5F7FA] transition-colors">
          Cancelar
        </Link>
        <button
          onClick={onNext}
          className="flex-1 py-3 text-[14px] font-medium bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

function Step2Data({ data, setData, onBack, onNext }: {
  data: { title: string; price: string; type: string; operation: string };
  setData: (d: any) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-[20px] font-semibold text-[#212121] mb-6">Datos principales</h2>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-[13px] font-medium text-[#212121] mb-1.5">Título de la propiedad</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Ej: Departamento en Miraflores con terraza"
            className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#212121] mb-1.5">Precio</label>
          <input
            type="text"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            placeholder="S/ 950,000"
            className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-medium text-[#212121] mb-1.5">Tipo</label>
            <select
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
              className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors bg-white"
            >
              <option>Departamento</option><option>Casa</option><option>Local</option><option>Oficina</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#212121] mb-1.5">Operación</label>
            <select
              value={data.operation}
              onChange={(e) => setData({ ...data, operation: e.target.value })}
              className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors bg-white"
            >
              <option>Venta</option><option>Renta</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 text-[14px] font-medium border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#F5F7FA] transition-colors">
          ← Atrás
        </button>
        <button onClick={onNext} className="flex-1 py-3 text-[14px] font-medium bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors">
          Siguiente →
        </button>
      </div>
    </div>
  );
}

function Step3Details({ details, setDetails, onBack, onNext }: {
  details: { beds: string; baths: string; sqm: string; description: string };
  setDetails: (d: any) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-[20px] font-semibold text-[#212121] mb-6">Detalles</h2>
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "beds", label: "Recámaras" },
            { key: "baths", label: "Baños" },
            { key: "sqm", label: "m²" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-[13px] font-medium text-[#212121] mb-1.5">{label}</label>
              <input
                type="number"
                value={(details as any)[key]}
                onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
                className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#212121] mb-1.5">Descripción</label>
          <textarea
            value={details.description}
            onChange={(e) => setDetails({ ...details, description: e.target.value })}
            placeholder="Describe la propiedad, amenidades, ubicación..."
            rows={4}
            className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors resize-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 text-[14px] font-medium border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#F5F7FA] transition-colors">
          ← Atrás
        </button>
        <button onClick={onNext} className="flex-1 py-3 text-[14px] font-medium bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors">
          Siguiente →
        </button>
      </div>
    </div>
  );
}

function Step4Publish({ onBack, onPublish }: { onBack: () => void; onPublish: () => void }) {
  return (
    <div>
      <h2 className="text-[20px] font-semibold text-[#212121] mb-6">Revisar y Publicar</h2>
      <div className="bg-[#E8F5E9] rounded-xl p-5 mb-5 text-center">
        <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[16px] font-semibold text-[#212121]">¡Todo listo para publicar!</p>
        <p className="text-[13px] text-[#757575] mt-1">Tu propiedad estará visible en tu portafolio público inmediatamente.</p>
      </div>
      <div className="space-y-3 mb-6">
        {[
          { label: "Fotos", value: "2 fotos subidas", ok: true },
          { label: "Precio", value: "S/ 950,000", ok: true },
          { label: "Descripción", value: "Completada", ok: true },
          { label: "Detalles", value: "2 rec · 2 baños · 85 m²", ok: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F5F7FA]">
            <span className="text-[13px] text-[#757575]">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#212121]">{item.value}</span>
              <span className="text-[#4CAF50] text-[16px]">✓</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 text-[14px] font-medium border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#F5F7FA] transition-colors">
          ← Atrás
        </button>
        <button onClick={onPublish} className="flex-1 py-3 text-[14px] font-medium bg-[#4CAF50] text-white rounded-lg hover:bg-green-700 transition-colors">
          Publicar Propiedad ✓
        </button>
      </div>
    </div>
  );
}
