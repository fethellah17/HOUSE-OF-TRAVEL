import Layout from "@/components/Layout";
import TripCard from "@/components/TripCard";
import { useData } from "@/contexts/DataContext";
import { VoyageCategory } from "@/types";

interface VoyageListPageProps {
  category: VoyageCategory;
  title: string;
  description: string;
}

const VoyageListPage = ({ category, title, description }: VoyageListPageProps) => {
  const { voyages } = useData();
  const trips = voyages.filter((v) => v.category === category);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <p className="text-upperspace text-primary mb-2">{category}</p>
            <h1 className="text-3xl md:text-4xl font-medium mb-4">{title}</h1>
            <p className="text-muted-foreground max-w-lg">{description}</p>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((v, i) => (
                <TripCard key={v.id} voyage={v} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground">
                Aucun voyage ne correspond à vos critères. Découvrez toutes nos offres.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default VoyageListPage;
