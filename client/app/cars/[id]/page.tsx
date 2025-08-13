import { CarDetail } from "@/components/pages/car-detail";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  return <CarDetail carId={id} />;
}
