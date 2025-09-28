import ProfessionalNavbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <ProfessionalNavbar />
      {children}
    </div>
  );
}
