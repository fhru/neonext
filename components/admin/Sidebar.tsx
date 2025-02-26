export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="absolute top-0 left-0 bg-red-500 text-foreground w-16">
        <h1>Sidebar ini</h1>
      </div>
      <div className="ml-24 p-6">{children}</div>
    </div>
  );
}
