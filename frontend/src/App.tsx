import React, { useState } from "react";
import { 
  IndianRupee, ShieldCheck, ChevronRight, Calculator, 
  Briefcase, Home, Activity, TrendingUp, Coins, FileText, Info 
} from "lucide-react";

const TaxCalculatorUI = () => {
  const [formData, setFormData] = useState({
    gross_salary: 1500000,
    rental_income: 0,
    business_income: 0,
    capital_gains: 0,
    other_income: 0,
    nps_corporate: 0,
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await resp.json();
      setData(result);
    } catch (err) {
      console.error("Calculation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const incomeFields = [
    { id: "gross_salary", label: "Salary Income", icon: <Briefcase className="w-4 h-4" /> },
    { id: "rental_income", label: "House Property (Rent)", icon: <Home className="w-4 h-4" /> },
    { id: "business_income", label: "Business/Profession", icon: <Activity className="w-4 h-4" /> },
    { id: "capital_gains", label: "Capital Gains", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "other_income", label: "Other Sources", icon: <Coins className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[32px] overflow-hidden bg-white">
        
        {/* LEFT PANEL: Inputs */}
        <div className="lg:w-[35%] bg-[#1E293B] p-8 text-white flex flex-col border-r border-slate-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">WealthSuite <span className="text-blue-400 text-sm">Pro</span></h1>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto pr-2">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Five Heads of Income</p>
            
            {incomeFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                  {field.icon} {field.label}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: Number(e.target.value) })}
                    className="w-auto min-w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white focus:border-blue-500 transition-all outline-none font-semibold text-sm"
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-700/50">
              <label className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">NPS Corporate (Sec 80CCD2)</label>
              <input
                type="number"
                value={formData.nps_corporate}
                onChange={(e) => setFormData({ ...formData, nps_corporate: Number(e.target.value) })}
                className="w-full bg-[#0F172A] border border-indigo-900/30 rounded-xl py-3 px-4 mt-2 text-white focus:border-blue-500 outline-none font-semibold text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-sm mt-8 transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? "GENERATING..." : "COMPUTE TAXATION"}
          </button>
        </div>

        {/* RIGHT PANEL: Detailed Results */}
        <div className="flex-1 bg-white p-8 lg:p-12 overflow-y-auto">
          {data ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" /> Computation Table
                </h2>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  AY 2026-27 (New Regime)
                </div>
              </div>

              {/* High-level Tax Summary Card */}
              <div className="bg-[#1E293B] rounded-[24px] p-8 text-white mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Final Net Tax Liability</p>
                  <h3 className="text-5xl font-black text-white tracking-tighter">
                    ₹{Math.round(data.results?.total_tax).toLocaleString("en-IN")}
                  </h3>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-bold uppercase">Effective Rate</p>
                    <p className="text-lg font-bold">
                      {data.summary?.net_taxable > 0 
                        ? ((data.results.total_tax / data.summary.net_taxable) * 100).toFixed(2) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="space-y-1 mb-8">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Computation of Total Income</p>
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase">
                      <tr>
                        <th className="px-6 py-4">Income Head / Description</th>
                        <th className="px-6 py-4 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="px-6 py-4 text-slate-600">I. Income from Salary (Net of Std. Deduction)</td>
                        <td className="px-6 py-4 text-right font-semibold">₹{data.summary?.salary_net?.toLocaleString("en-IN") || "0"}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-slate-600">II. Income from House Property (Net of 30% Deduction)</td>
                        <td className="px-6 py-4 text-right font-semibold">₹{data.summary?.house_net?.toLocaleString("en-IN") || "0"}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-slate-600">III. Profits & Gains from Business/Profession</td>
                        <td className="px-6 py-4 text-right font-semibold">₹{formData.business_income.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-slate-600">IV. Capital Gains</td>
                        <td className="px-6 py-4 text-right font-semibold">₹{formData.capital_gains.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-slate-600">V. Income from Other Sources</td>
                        <td className="px-6 py-4 text-right font-semibold">₹{formData.other_income.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-blue-50/30">
                        <td className="px-6 py-4 font-bold text-slate-800 uppercase text-xs">Gross Total Income (GTI)</td>
                        <td className="px-6 py-4 text-right font-black text-blue-700">₹{data.summary?.total_gross_income?.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-slate-500 italic">Less: Deductions under Chapter VI-A (NPS 80CCD2)</td>
                        <td className="px-6 py-4 text-right text-red-600">(-) ₹{data.summary?.nps_deduction?.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-slate-900 text-white">
                        <td className="px-6 py-4 font-bold uppercase text-xs tracking-widest">Net Taxable Income</td>
                        <td className="px-6 py-4 text-right font-black">₹{data.summary?.net_taxable?.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Component Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
  
  {/* 1. Base Tax */}
  <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Base Tax</p>
    <p className="text-xl font-bold text-slate-800">
      ₹{Math.round(data.results?.tax_after_rebate).toLocaleString("en-IN")}
    </p>
  </div>

  {/* 2. Surcharge */}
  <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      Surcharge ({data.results?.s_rate * 100}%)
    </p>
    <p className="text-xl font-bold text-slate-800">
      ₹{Math.round(data.results?.surcharge).toLocaleString("en-IN")}
    </p>
  </div>

  {/* 3. Cess */}
  <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Edu Cess (4%)</p>
    <p className="text-xl font-bold text-slate-800">
      ₹{Math.round(data.results?.cess).toLocaleString("en-IN")}
    </p>
  </div>

  {/* 4. Total Tax (The New Summary Column) */}
  <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50/40 ring-1 ring-blue-200/50">
    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Tax Payable</p>
    <p className="text-xl font-black text-blue-900">
      ₹{Math.round(data.results?.total_tax).toLocaleString("en-IN")}
    </p>
  </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-dashed border-slate-300">
                <ShieldCheck className="w-8 h-8 text-slate-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Financial Analysis Ready</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm mt-2">
                  Enter your earnings across the five heads of income to generate a professional tax computation report.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TaxCalculatorUI;
