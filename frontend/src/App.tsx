import React, { useState } from "react";
import { IndianRupee, ShieldCheck, ChevronRight, Calculator, PieChart, TrendingDown, Info, Wallet } from "lucide-react";

const TaxCalculatorUI = () => {
  const [formData, setFormData] = useState({
    gross_salary: 1500000,
    interest_income: 0,
    rental_income: 0,
    other_income: 0,
    nps_corporate: 0,
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const payload = {
        gross_salary: Number(formData.gross_salary) || 0,
        interest_income: Number(formData.interest_income) || 0,
        rental_income: Number(formData.rental_income) || 0,
        other_income: Number(formData.other_income) || 0,
        nps_corporate: Number(formData.nps_corporate) || 0,
      };

      const resp = await fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await resp.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[32px] overflow-hidden min-h-[750px]">
        
        {/* LEFT PANEL: Deep Professional Command Center */}
        <div className="lg:w-[42%] bg-[#1E293B] p-8 lg:p-12 text-white flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TaxEngine<span className="text-blue-400">2026</span></h1>
          </div>

          <div className="space-y-6 flex-1">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">Income Parameters</p>
            
            {[
              { id: "gross_salary", label: "Annual Salary", icon: "💼" },
              { id: "interest_income", label: "Investment Interest", icon: "📈" },
              { id: "rental_income", label: "Rental Earnings", icon: "🏠" },
              { id: "other_income", label: "Miscellaneous", icon: "✨" },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1 italic">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-4 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none font-semibold"
                  />
                </div>
              </div>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-700/50">
              <label className="text-xs font-bold text-blue-400 ml-1">NPS CORPORATE (80CCD2)</label>
              <input
                type="number"
                value={formData.nps_corporate}
                onChange={(e) => setFormData({ ...formData, nps_corporate: e.target.value })}
                className="w-full bg-[#0F172A] border border-blue-900/30 rounded-2xl py-4 px-6 mt-2 text-white focus:border-blue-500 outline-none font-semibold"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-lg mt-10 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            {loading ? "CALCULATING..." : "GENERATE REPORT"}
          </button>
        </div>

        {/* RIGHT PANEL: Soothing Results Display */}
        <div className="flex-1 bg-white p-8 lg:p-12 flex flex-col justify-center">
          {data ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <header className="mb-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter mb-4">
                  <ShieldCheck className="w-4 h-4" /> Final Assessment AY 2026-27
                </div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Tax Report Summary</h2>
              </header>

              <div className="grid gap-6">
                {/* Main Tax Card */}
                <div className="bg-[#F8FAFC] border border-slate-200 p-8 rounded-[28px] relative overflow-hidden group hover:border-blue-200 transition-colors">
                  <div className="relative z-10">
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-2">Total Tax Liability</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-light text-slate-400">₹</span>
                      <h3 className="text-7xl font-black text-slate-900 tracking-tighter">
                        {Math.round(data.results?.total_tax).toLocaleString("en-IN")}
                      </h3>
                    </div>
                  </div>
                  <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 group-hover:text-blue-50 transition-colors" />
                </div>

                {/* Sub-details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxable Income</p>
                      <p className="text-xl font-extrabold text-slate-700">₹{data.summary?.net_taxable.toLocaleString("en-IN")}</p>
                    </div>
                    <PieChart className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Effective Rate</p>
                      <p className="text-xl font-extrabold text-slate-700">
                        {data.summary?.net_taxable > 0 
                          ? ((data.results.total_tax / data.summary.net_taxable) * 100).toFixed(1) 
                          : 0}%
                      </p>
                    </div>
                    <TrendingDown className="w-6 h-6 text-slate-300" />
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    Calculation includes <span className="text-blue-700 font-bold">Standard Deduction (₹75k)</span> and applicable Section 87A rebates.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-300">
                <IndianRupee className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Ready for Analysis?</h3>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                Enter your income data in the left panel to generate your 2026-27 comprehensive tax breakdown.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TaxCalculatorUI;
