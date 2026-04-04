export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Welcome back</h1>
        <p className="text-slate-500 text-lg">
          This is the sample work for the Wholcure CRM dashboard built with Next.js 14
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-8 border-b border-gray-200">
        {["Overview", "Analytics", "Operations"].map((tab, idx) => (
          <button 
            key={tab} 
            className={`pb-4 text-sm font-medium transition-colors ${
              idx === 0 ? "border-b-2 border-emerald-500 text-emerald-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Placeholder for Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center text-gray-400 border-dashed">
          Audience Overview Chart (Coming Soon)
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center text-gray-400 border-dashed">
          Returning Customers (Coming Soon)
        </div>
      </div>
    </div>
  );
}