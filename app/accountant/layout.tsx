import AccountantLayout from '@/components/layout/AccountantLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountantLayout>
      {children}
    </AccountantLayout>
  );
}
