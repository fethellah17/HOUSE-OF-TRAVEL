import Layout from "@/components/Layout";
import DevisForm from "@/components/DevisForm";
import { useLocation } from "react-router-dom";

const DevisPage = () => {
  const location = useLocation();
  const tripName = (location.state as { tripName?: string })?.tripName || "";

  return (
    <Layout>
      <DevisForm prefilledDestination={tripName} showLayout={true} />
    </Layout>
  );
};

export default DevisPage;
