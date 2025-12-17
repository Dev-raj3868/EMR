// import { ReactNode } from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/AppSidebar";
// import { DashboardNavbar } from "@/components/DashboardNavbar";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// const DashboardLayout = ({ children }: DashboardLayoutProps) => {
//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full bg-background">
//         <AppSidebar />
//         <div className="flex-1 flex flex-col w-full">
//           <DashboardNavbar />
//           <main className="flex-1 p-6">
//             {children}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default DashboardLayout;


import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar — hide on print */}
        <div className="print:hidden">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col w-full">
          {/* Navbar — hide on print */}
          <div className="print:hidden">
            <DashboardNavbar />
          </div>

          {/* Main content — full width on print */}
          <main className="flex-1 p-6 print:p-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
