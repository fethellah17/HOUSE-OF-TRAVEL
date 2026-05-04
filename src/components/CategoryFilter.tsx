import { VoyageCategory } from "@/types";

interface CategoryFilterProps {
  categories: VoyageCategory[];
  active: VoyageCategory | "Tous";
  onChange: (cat: VoyageCategory | "Tous") => void;
}

const CategoryFilter = ({ categories, active, onChange }: CategoryFilterProps) => {
  const all: (VoyageCategory | "Tous")[] = ["Tous", ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${active === cat
              ? "bg-primary text-primary-foreground shadow-elegant"
              : "bg-secondary text-secondary-foreground hover:bg-accent/20"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
