import SpecialistLayout from '@/components/layout/SpecialistLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpecialistLayout>
      {children}
    </SpecialistLayout>
  );
}
