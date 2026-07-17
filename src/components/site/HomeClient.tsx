import Hero from "./Hero";
import DonateSection from "./DonateSection";

interface Props {
  qrImageUrl: string | null;
}

export default function HomeClient({ qrImageUrl }: Props) {
  return (
    <div>
      <Hero />
      <DonateSection qrImageUrl={qrImageUrl} />
    </div>
  );
}
