import { MachineDetail } from "@/components/pages/machine-detail";

interface MachineDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MachineDetailPage({ params }: MachineDetailPageProps) {
  const { id } = await params;
  return <MachineDetail machineId={id} />;
}
