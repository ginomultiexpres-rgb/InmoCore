import { useState } from "react";

const COLOR_PRESETS = [
  { name: "azul", value: "#1E88E5" },
  { name: "verde", value: "#4CAF50" },
  { name: "rojo", value: "#F44336" },
  { name: "morado", value: "#9C27B0" },
  { name: "naranja", value: "#FF9800" },
  { name: "oscuro", value: "#212121" },
];

const STYLES = [
  { id: "minimalista", label: "Minimalista", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=120&h=80&fit=crop&auto=format" },
  { id: "elegante", label: "Elegante", img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=120&h=80&fit=crop&auto=format" },
  { id: "moderno", label: "Moderno", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=120&h=80&fit=crop&auto=format" },
];

export default function Branding() {
  const [primaryColor, setPrimaryColor] = useState("#1E88E5");
  const [name, setName] = useState("Juan Pérez");
  const [title, setTitle] = useState("Asesor Inmobiliario");
  const [bio, setBio] = useState("");
  const [style, setStyle] = useState("minimalista");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-semibold text-[#212121] mb-6">Branding / Personalización</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: editor */}
        <div className="xl:col-span-2 space-y-5">
          {/* Colors */}
          <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Colores</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setPrimaryColor(c.value)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-10 h-10 rounded-full transition-all hover:scale-110"
                    style={{
                      background: c.value,
                      boxShadow: primaryColor === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.value}` : "none",
                    }}
                  >
                    {primaryColor === c.value && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <span className="text-white text-[11px] font-bold">{c.value.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#757575]">{c.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              {["#1E88E5", "#42A5F5", "#4CAF50", "#757575", "#212121"].map((c) => (
                <button
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  className="w-8 h-5 rounded transition-all hover:scale-110"
                  style={{
                    background: c,
                    outline: primaryColor === c ? `2px solid ${c}` : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Identity */}
          <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Identidad</h3>
            <div
              className="border-2 border-dashed border-[#E0E0E0] rounded-xl h-24 flex flex-col items-center justify-center gap-1.5 mb-4 hover:border-[#1E88E5] transition-colors cursor-pointer"
              style={{ background: "#FAFAFA" }}
            >
              <svg className="w-8 h-8 text-[#BDBDBD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path d="M3 9l2.45-2.45A2 2 0 016.86 6H9l1-2h4l1 2h2.14a2 2 0 011.41.55L21 9v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" />
              </svg>
              <span className="text-[12px] text-[#BDBDBD]">Arrastra tu logo o haz clic para subir</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Información</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] text-[#757575] mb-1">Nombre a mostrar</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#757575] mb-1">Título profesional</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#757575] mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Especialista en propiedades residenciales en CDMX..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Estilo</h3>
            <div className="flex gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                    style === s.id ? "border-[#1E88E5]" : "border-[#E0E0E0]"
                  }`}
                >
                  <img src={s.img} alt={s.label} className="w-full h-16 object-cover" />
                  <div className="py-2 text-center text-[12px] font-medium text-[#212121]">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#1E88E5]" />
              <span className="text-[13px] font-semibold text-[#212121]">Vista Previa</span>
            </div>
            {/* Phone mockup */}
            <div className="bg-[#F5F7FA] rounded-2xl p-4 mx-auto max-w-[200px]">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-[18px] font-bold"
                  style={{ background: primaryColor }}
                >
                  {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-[#212121]">{name}</p>
                  <p className="text-[11px] text-[#757575]">{title}</p>
                </div>
                <div className="w-full rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=200&h=120&fit=crop&auto=format"
                    alt="Preview property"
                    className="w-full h-24 object-cover"
                  />
                  <div className="bg-white px-2.5 py-2">
                    <p className="text-[11px] font-semibold text-[#212121]">
                      {style.charAt(0).toUpperCase() + style.slice(1)} Inmobiliario
                    </p>
                    <p className="text-[10px] text-[#757575]">Desde $2.5M MXN</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-3 h-3 rounded-sm" style={{ background: primaryColor }} />
                      <span className="text-[10px] text-[#757575]">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSave}
              className="py-3 text-[14px] font-medium text-white rounded-lg transition-colors"
              style={{ background: saved ? "#4CAF50" : primaryColor }}
            >
              {saved ? "✓ Cambios guardados" : "Guardar Cambios"}
            </button>
            <button className="py-3 text-[14px] font-medium border border-[#E0E0E0] rounded-lg text-[#212121] hover:bg-[#F5F7FA] transition-colors">
              Vista Previa en Nueva Pestaña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
