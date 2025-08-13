import { LandDetail } from "@/components/pages/land-detail";

interface LandDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LandDetailPage({ params }: LandDetailPageProps) {
  const { id } = await params;
  return <LandDetail landId={id} />;
}
