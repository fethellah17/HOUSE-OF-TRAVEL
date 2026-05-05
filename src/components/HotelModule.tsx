import { motion } from "framer-motion";

interface HotelModuleProps {
  category: string;
  form: {
    nomHotel: string;
    nombreEtoiles: string;
    nombreChambres: string;
    typeChambre: string;
    pension: string;
  };
  setForm: (form: any) => void;
  voyageData?: any;
}

const HotelModule = ({ category, form, setForm, voyageData }: HotelModuleProps) => {
  if (category === "Omrah") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
      >
        <h2 className="text-xl font-bold text-[#0a2357] mb-4 pb-2 border-b border-gray-200">
          Hébergement Omrah
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Nom de l'hôtel</label>
            <input
              type="text"
              value={form.nomHotel}
              onChange={(e) => setForm({ ...form, nomHotel: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
              placeholder="Ex: Hilton Makkah"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Nombre d'étoiles</label>
            <select
              value={form.nombreEtoiles}
              onChange={(e) => setForm({ ...form, nombreEtoiles: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
            >
              <option value="">Sélectionner</option>
              <option value="3 étoiles">3 étoiles</option>
              <option value="4 étoiles">4 étoiles</option>
              <option value="5 étoiles">5 étoiles</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Distance du Haram</label>
            <select
              value={form.typeChambre}
              onChange={(e) => setForm({ ...form, typeChambre: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
            >
              <option value="">Sélectionner</option>
              <option value="0-500m">0-500m (Vue sur le Haram)</option>
              <option value="500m-1km">500m-1km (Proche)</option>
              <option value="1km-2km">1km-2km (Accessible)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Nombre de chambres</label>
            <input
              type="number"
              min="1"
              value={form.nombreChambres}
              onChange={(e) => setForm({ ...form, nombreChambres: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
              placeholder="1"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (category === "Voyage Organisé") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
      >
        <h2 className="text-xl font-bold text-[#0a2357] mb-4 pb-2 border-b border-gray-200">
          Hébergement Voyage Organisé
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Type de chambre</label>
            <select
              value={form.typeChambre}
              onChange={(e) => setForm({ ...form, typeChambre: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
            >
              <option value="">Sélectionner</option>
              <option value="Simple">Simple</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Quadruple">Quadruple</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Pension</label>
            <select
              value={form.pension}
              onChange={(e) => setForm({ ...form, pension: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
            >
              <option value="">Sélectionner</option>
              <option value="Petit-déjeuner">Petit-déjeuner</option>
              <option value="Demi-pension">Demi-pension</option>
              <option value="Pension complète">Pension complète</option>
              <option value="All inclusive">All inclusive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Nombre de chambres</label>
            <input
              type="number"
              min="1"
              value={form.nombreChambres}
              onChange={(e) => setForm({ ...form, nombreChambres: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
              placeholder="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">Nombre d'étoiles</label>
            <select
              value={form.nombreEtoiles}
              onChange={(e) => setForm({ ...form, nombreEtoiles: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0a2357] focus:ring-2 focus:ring-[#0a2357]/20 transition-all"
            >
              <option value="">Sélectionner</option>
              <option value="3 étoiles">3 étoiles</option>
              <option value="4 étoiles">4 étoiles</option>
              <option value="5 étoiles">5 étoiles</option>
            </select>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default HotelModule;
