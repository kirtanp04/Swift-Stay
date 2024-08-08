import { useParams } from "react-router-dom";
import Page from "src/components/Page";

export default function PropertyDetails() {
  const { propertyName } = useParams();
  return <Page title={propertyName!}>PropertyDetails</Page>;
}
