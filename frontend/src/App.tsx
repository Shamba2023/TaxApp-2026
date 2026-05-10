import React, { useState } from "react";
import { IndianRupee, ShieldCheck, ChevronRight, Calculator, PieChart, TrendingDown, Info } from "lucide-react";

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Top Decoration Bar */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-4">
            <ShieldCheck className="w-4 h-4" /> Finance Act 2025 Compliant
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Indian Tax <span className="text-blue-600">Suite</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl">
            Precision tax planning for Assessment Year 2026-27.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-8 border-b pb-4">
                <Calculator className="w-5 h-5 text-blue-600" /> Income Details
              </h2>

              <div className="space-y-5">
                {[
                  { id: "gross_salary", label: "Annual Gross Salary", icon: "💼" },
                  { id: "interest_income", label: "Interest Income", icon: "🏦" },
                  { id: "rental_income", label: "Rental Income", icon: "🏠" },
                  { id: "other_income", label: "Other Sources", icon: "✨" },
                ].map((field) => (
                  <div key={field.id} className="group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block group-focus-within:text-blue-600 transition-colors">
                      {field.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input
                        type="number"
                        value={formData[field.id]}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-6 mt-6 border-t border-dashed border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                      NPS Corporate (80CCD2)
                    </label>
                    <Info className="w-4 h-4 text-slate-300" />
                  </div>
                  <input
                    type="number"
                    value={formData.nps_corporate}
                    onChange={(e) => setFormData({ ...formData, nps_corporate: e.target.value })}
                    className="w-full px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-indigo-700"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className={`w-full mt-10 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                }`}
              >
                {loading ? "Calculating..." : "Calculate My Tax"} 
                <ChevronRight className="w-5 h-5" />
              </button>
            </section>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {data ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero Result */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-20 -mt-20" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-xs">Total Tax Liability</p>
                        <h3 className="text-6xl lg:text-7xl font-black mt-2 tracking-tighter">
                          ₹{Math.round(data.results?.total_tax).toLocaleString("en-IN")}
                        </h3>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                        <IndianRupee className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Taxable Income</p>
                        <p className="text-xl font-bold">₹{data.summary?.net_taxable.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Effective Rate</p>
                        <p className="text-xl font-bold">
                          {data.summary?.net_taxable > 0 
                            ? ((data.results.total_tax / data.summary.net_taxable) * 100).toFixed(1) 
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Surcharge</p>
                      <p className="text-xl font-extrabold text-slate-800">₹{Math.round(data.results?.surcharge).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Cess (4%)</p>
                      <p className="text-xl font-extrabold text-slate-800">₹{Math.round(data.results?.cess).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>

                {/* Rebate Note */}
                {data.results.rebate_adjustment > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex gap-4">
                    <div className="bg-emerald-500 text-white p-1 rounded-full h-fit">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <p className="text-emerald-800 text-sm font-medium leading-relaxed">
                      <strong>Tax Saved!</strong> You benefitted from ₹{data.results.rebate_adjustment.toLocaleString("en-IN")} in Section 87A Marginal Relief/Rebate.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                  <Calculator className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-slate-600 font-bold text-lg mb-2">Ready to Calculate?</h4>
                <p className="max-w-[280px] text-sm leading-relaxed">
                  Enter your income details and click the button to see your detailed 2026-27 tax report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorUI;
