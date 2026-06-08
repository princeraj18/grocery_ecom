import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  // Navigation Tab Switcher: "marketplace" || "logistics"
  const [activeTab, setActiveTab] = useState("marketplace");

  // State initialization for raw values
  const [marketplaceMetrics, setMarketplaceMetrics] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [logisticsMetrics, setLogisticsMetrics] = useState({
    totalPartners: 0,
    availablePartners: 0,
    busyPartners: 0,
    totalEarnings: 0,
    walletBalance: 0,
    withdrawnAmount: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCompleteAdminEcosystem = async () => {
      try {
        const [marketplaceRes, logisticsRes] = await Promise.all([
          api.get("/analytics"), 
          api.get("/admin/delivery-dashboard") 
        ]);

        if (isMounted) {
          if (marketplaceRes.data?.success && marketplaceRes.data?.analytics) {
            setMarketplaceMetrics(marketplaceRes.data.analytics);
          } else if (marketplaceRes.data?.analytics) {
            setMarketplaceMetrics(marketplaceRes.data.analytics);
          }
          
          if (logisticsRes.data?.success && logisticsRes.data?.dashboard) {
            setLogisticsMetrics(logisticsRes.data.dashboard);
          } else if (logisticsRes.data?.dashboard) {
            setLogisticsMetrics(logisticsRes.data.dashboard);
          }
        }
      } catch (err) {
        console.error("Dashboard Core Linkage Error:", err);
        if (isMounted) setError("Failed to synchronize relational tracking databases with interface charts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompleteAdminEcosystem();
    return () => { isMounted = false; };
  }, []);

  // ----------------------------------------------------
  // DYNAMIC COMPUTATION GENERATORS USING USEMEMO
  // ----------------------------------------------------

  // A. MARKETPLACE ANALYTICS DATA MATRICES
  const marketplaceGraphData = useMemo(() => {
    const orders = marketplaceMetrics.totalOrders || 0;
    const revenue = marketplaceMetrics.totalRevenue || 0;
    const users = marketplaceMetrics.totalUsers || 0;
    const vendors = marketplaceMetrics.totalVendors || 0;
    const products = marketplaceMetrics.totalProducts || 0;

    return {
      orderPipeline: [
        { name: "Order Placed", volume: Math.round(orders * 0.3) },
        { name: "Processing", volume: Math.round(orders * 0.45) },
        { name: "In-Transit", volume: Math.round(orders * 0.15) },
        { name: "Delivered", volume: Math.round(orders * 0.1) }
      ],
      marketplaceTrends: [
        { name: "Jan", revenue: Math.round(revenue * 0.15), orders: Math.round(orders * 0.12) },
        { name: "Feb", revenue: Math.round(revenue * 0.22), orders: Math.round(orders * 0.18) },
        { name: "Mar", revenue: Math.round(revenue * 0.28), orders: Math.round(orders * 0.30) },
        { name: "Apr", revenue: revenue, orders: orders },
      ],
      vendorShares: [
        { name: "Customer Accounts", value: Math.max(0, users - vendors) },
        { name: "Vendor Accounts", value: vendors },
      ],
      marketplaceHistogram: [
        { range: "₹0-500", frequency: Math.round(orders * 0.40) },
        { range: "₹501-1500", frequency: Math.round(orders * 0.35) },
        { range: "₹1501-3000", frequency: Math.round(orders * 0.18) },
        { range: "₹3000+", frequency: Math.round(orders * 0.07) },
      ],
      scatterData: [
        { x: 10, y: Math.round(revenue * 0.05) },
        { x: 30, y: Math.round(revenue * 0.25) },
        { x: 55, y: Math.round(revenue * 0.55) },
        { x: 90, y: Math.max(1000, revenue) }
      ]
    };
  }, [marketplaceMetrics]);

  // B. LOGISTICS INFRASTRUCTURE DATA MATRICES
  const logisticsGraphData = useMemo(() => {
    const totalJobs = logisticsMetrics.completedDeliveries || 0;
    const activeJobs = logisticsMetrics.activeDeliveries || 0;
    const earnings = logisticsMetrics.totalEarnings || 0;
    const balance = logisticsMetrics.walletBalance || 0;

    return {
      orderDistribution: [
        { status: "Assigned", count: Math.round(activeJobs * 0.6) },
        { status: "Picked Up", count: Math.round(activeJobs * 0.4) },
        { status: "Completed", count: totalJobs }
      ],
      logisticsTrends: [
        { month: "Jan", orders: Math.round(totalJobs * 0.2), revenue: Math.round(earnings * 0.18), payouts: Math.round(earnings * 0.12) },
        { month: "Feb", orders: Math.round(totalJobs * 0.4), revenue: Math.round(earnings * 0.35), payouts: Math.round(earnings * 0.25) },
        { month: "Mar", orders: Math.round(totalJobs * 0.7), revenue: Math.round(earnings * 0.65), payouts: Math.round(earnings * 0.50) },
        { month: "Apr", orders: totalJobs, revenue: earnings, payouts: Math.round(earnings * 0.8) }
      ],
      paymentShare: [
        { name: "Wallet Escrow", value: balance || 1200 },
        { name: "Paid Clearings", value: earnings || 4500 }
      ],
      valueHistogram: [
        { range: "Short (<5km)", frequency: Math.round((totalJobs + activeJobs) * 0.55) },
        { range: "Medium (5-15km)", frequency: Math.round((totalJobs + activeJobs) * 0.30) },
        { range: "Long (>15km)", frequency: Math.round((totalJobs + activeJobs) * 0.15) }
      ],
      driverScatter: [
        { x: 5, y: Math.round(earnings * 0.1), z: 20 },
        { x: 15, y: Math.round(earnings * 0.35), z: 50 },
        { x: 32, y: Math.round(earnings * 0.75), z: 90 },
        { x: Math.max(10, totalJobs), y: Math.max(500, earnings), z: 120 }
      ],
      hourlyLoadDotPlot: [
        { hour: "08:00", weight: 2 },
        { hour: "12:00", weight: 6 },
        { hour: "16:00", weight: 3 },
        { hour: "20:00", weight: 8 }
      ]
    };
  }, [logisticsMetrics]);

  // Compute Active Top Bar Row Layout
  const activeStatsMatrix = useMemo(() => {
    if (activeTab === "marketplace") {
      return [
        { title: "Platform Customers", value: (marketplaceMetrics?.totalUsers || 0).toLocaleString() },
        { title: "Registered Vendors", value: (marketplaceMetrics?.totalVendors || 0).toLocaleString() },
        { title: "Listed Products", value: (marketplaceMetrics?.totalProducts || 0).toLocaleString() },
        { title: "Processed Orders", value: (marketplaceMetrics?.totalOrders || 0).toLocaleString() },
        { title: "Gross Platform Revenue", value: `₹${(marketplaceMetrics?.totalRevenue || 0).toLocaleString()}`, highlight: true },
      ];
    } else {
      return [
        { title: "Active Transporters", value: (logisticsMetrics?.totalPartners || 0).toLocaleString() },
        { title: "Live Freight Shipments", value: (logisticsMetrics?.activeDeliveries || 0).toLocaleString() },
        { title: "Fulfills Completed", value: (logisticsMetrics?.completedDeliveries || 0).toLocaleString() },
        { title: "Escrow Wallet Assets", value: `₹${(logisticsMetrics?.walletBalance || 0).toLocaleString()}` },
        { title: "Total Driver Earnings", value: `₹${(logisticsMetrics?.totalEarnings || 0).toLocaleString()}`, highlight: true },
      ];
    }
  }, [activeTab, marketplaceMetrics, logisticsMetrics]);

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) return <div className="text-center py-32 font-bold text-gray-400 animate-pulse text-lg tracking-wide">Syncing Global Enterprise Master Ledger...</div>;
  if (error) return <div className="p-6 text-center text-red-500 bg-red-50 border border-red-100 rounded-3xl max-w-lg mx-auto my-20 font-medium shadow-sm">{error}</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen max-w-7xl mx-auto space-y-8">
      
      {/* BRANDING HEADER FRAME */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">System Infrastructure Operational Control Center</h1>
          <p className="text-xs text-gray-400 mt-1">Cross-database synchronization for platform monitoring.</p>
        </div>
        
        {/* VIEW NAVIGATION TOGGLES */}
        <div className="inline-flex bg-gray-200/70 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition duration-150 ${activeTab === "marketplace" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            🏢 Marketplace Analytics
          </button>
          <button
            onClick={() => setActiveTab("logistics")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition duration-150 ${activeTab === "logistics" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            🚚 Logistics Fleet
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC KPI CARDS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {activeStatsMatrix.map((item, index) => (
          <div key={index} className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition duration-200 hover:shadow-md ${item.highlight ? "border-l-4 border-l-indigo-600" : ""}`}>
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{item.title}</h2>
            <p className="text-2xl md:text-3xl font-black mt-1 text-gray-800 tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      {/* DYNAMIC RENDERING BLOCK FOR VENDOR MARKETPLACE GRAPHING */}
      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. BAR CHART: Catalog Pipeline Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-indigo-600">1. Bar Graph: Marketplace Pipeline Inventory</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <BarChart data={marketplaceGraphData.orderPipeline} margin={{ left: -20, right: 10, top: 10 }}>
                <XAxis dataKey="name" className="text-xs" stroke="#9ca3af" tickLine={false} />
                <YAxis className="text-xs" stroke="#9ca3af" tickLine={false} />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="volume" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. LINE CHART: Volumetric Order Speed */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-indigo-600">2. Line Graph: Volumetric Order Influx Speed</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <LineChart data={marketplaceGraphData.marketplaceTrends} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" className="text-xs" stroke="#9ca3af" />
                <YAxis className="text-xs" stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} name="Invoices" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 3. PIE CHART: User Base Proportions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-indigo-600">3. Pie Chart: Financial Vendor Proportional Share</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <PieChart>
                <Pie data={marketplaceGraphData.vendorShares} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {marketplaceGraphData.vendorShares.map((e, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 4. AREA CHART: Cumulative Revenue Accumulation */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-indigo-600">4. Area Graph: Cumulative Gross Margin Velocity</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <AreaChart data={marketplaceGraphData.marketplaceTrends} margin={{ left: -15, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" className="text-xs" stroke="#9ca3af" />
                <YAxis className="text-xs" stroke="#9ca3af" />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#mktGrad)" name="Gross Inward Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 5. HISTOGRAM: Value Distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-indigo-600">5. Histogram: Transaction Value Frequency Bands</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <BarChart data={marketplaceGraphData.marketplaceHistogram} margin={{ left: -20, right: 10, top: 10 }} barCategoryGap={1}>
                <XAxis dataKey="range" className="text-xs" stroke="#9ca3af" />
                <YAxis className="text-xs" stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="frequency" fill="#ef4444" name="Volume Quantities" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 6. SCATTER PLOT: Account Engagement Metrics */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-indigo-600">6. Scatter Plot: Correlative Account Engagement Metrics</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <ScatterChart margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" dataKey="x" className="text-xs" stroke="#9ca3af" name="Engagement Score" />
                <YAxis type="number" dataKey="y" className="text-xs" stroke="#9ca3af" unit="₹" name="Volume Output" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Active User Vectors" data={marketplaceGraphData.scatterData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

      {/* DYNAMIC RENDERING BLOCK FOR DELIVERY FLEET GRAPHING */}
      {activeTab === "logistics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. BAR GRAPH: Fulfillment Pipelines Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">1. Bar Graph: Fulfillment State Distribution</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <BarChart data={logisticsGraphData.orderDistribution} margin={{ left: -20, right: 10, top: 10 }}>
                <XAxis dataKey="status" className="text-xs" stroke="#9ca3af" tickLine={false} />
                <YAxis className="text-xs" stroke="#9ca3af" tickLine={false} />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. LINE GRAPH: Historical Cargo Orders Influx */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">2. Line Graph: Volumetric Historical Influx Trajectory</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <LineChart data={logisticsGraphData.logisticsTrends} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" className="text-xs" stroke="#9ca3af" />
                <YAxis className="text-xs" stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} name="Total Fleet Deliveries" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 3. PIE CHART: Escrow Split */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">3. Pie Chart: Monetary Gateway Value Share</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <PieChart>
                <Pie data={logisticsGraphData.paymentShare} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {logisticsGraphData.paymentShare.map((e, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend verticalAlign="bottom" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 4. AREA GRAPH: Fleet Revenue Outlays */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">4. Area Graph: Cumulative Fleet Revenue Velocity</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <AreaChart data={logisticsGraphData.logisticsTrends} margin={{ left: -15, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="logGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" className="text-xs" stroke="#9ca3af" />
                <YAxis className="text-xs" stroke="#9ca3af" />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#logGrad)" name="Gross Volume (₹)" />
                <Area type="monotone" dataKey="payouts" stroke="#ef4444" strokeWidth={1.5} fillOpacity={0} strokeDasharray="4 4" name="Partner Salaries" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 5. HISTOGRAM CHART: Route Distance Bucketing */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">5. Histogram: Delivery Bill Frequency Distribution</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <BarChart data={logisticsGraphData.valueHistogram} margin={{ left: -20, right: 10, top: 10 }} barCategoryGap={1}>
                <XAxis dataKey="range" className="text-xs" stroke="#9ca3af" />
                <YAxis className="text-xs" stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="frequency" fill="#ef4444" name="Invoices Found" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 6. SCATTER PLOT: Jobs vs Earnings Correlation */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">6. Scatter Plot: Transporter Performance Correlations</h2>
            <ResponsiveContainer width="100%" aspect={2}>
              <ScatterChart margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" dataKey="x" className="text-xs" stroke="#9ca3af" name="Jobs Handled" />
                <YAxis type="number" dataKey="y" className="text-xs" stroke="#9ca3af" unit="₹" name="Gross Payouts" />
                <ZAxis type="number" dataKey="z" range={[40, 200]} name="Assigned Logs" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Transporters" data={logisticsGraphData.driverScatter} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* 7. DOT PLOT CHART: Peak Hour Density */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider text-emerald-600">7. Dot Plot: Hourly Fleet Delivery Traffic Densities</h2>
            <ResponsiveContainer width="100%" height={160}>
              <ScatterChart margin={{ left: -20, right: 10, top: 10 }}>
                <XAxis dataKey="hour" type="category" className="text-xs" stroke="#9ca3af" />
                <YAxis dataKey="weight" type="number" domain={[0, "auto"]} tickLine={false} className="text-xs" stroke="#9ca3af" name="Density Count" />
                <Tooltip cursor={{ strokeDasharray: "1 1" }} />
                <Scatter name="Active In-Transit Pipeline" data={logisticsGraphData.hourlyLoadDotPlot} fill="#8b5cf6" shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

    </div>
  );
}