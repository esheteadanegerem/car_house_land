import { HouseDetail } from "@/components/pages/house-detail";

interface HouseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HouseDetailPage({ params }: HouseDetailPageProps) {
  const { id } = await params;
  return <HouseDetail houseId={id} />;
}
