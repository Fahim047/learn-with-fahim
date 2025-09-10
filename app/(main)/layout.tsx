import ProfessionalNavbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProfessionalNavbar />
      {children}
    </>
  );
}
