// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-[#f4f7fa]">
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-[1400px] mx-auto">
//              {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fa]">
      {/* Sidebar yahan ayega */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar yahan ayega */}
        <Navbar />

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}