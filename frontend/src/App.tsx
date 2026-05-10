import React, { useState } from "react";
import { IndianRupee, PieChart, ShieldCheck, ChevronRight } from "lucide-react";

const TaxCalculatorUI = () => {
  const [formData, setFormData] = useState({
    gross_salary: 1500000,
    interest_income: 0,
    rental_income: 0,
    other_income: 0,
    nps_corporate: 0,
  });

  const [data, setData] = useState(null);

  const handleCalculate = async () => {
    const resp = await fetch("/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await resp.json();
    setData(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" /> Income Sources
            </h2>

            {[
              "gross_salary",
              "interest_income",
              "rental_income",
              "other_income",
            ].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  {field.replace("_", " ")}
                </label>
                <input
                  type="number"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            ))}

            <div className="pt-4 border-t mt-6">
              <label className="block text-xs font-bold text-green-600 uppercase mb-1">
                NPS Corporate (80CCD2)
              </label>
              <input
                type="number"
                value={formData.nps_corporate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nps_corporate: Number(e.target.value),
                  })
                }
                className="w-full p-3 bg-green-50 border border-green-100 rounded-lg outline-none"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              Compute Tax <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Results Dashboard */}
        <div className="lg:col-span-2">
          {data ? (
            <div className="space-y-6">
              {/* Main Result Card */}
              <div className="bg-blue-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="opacity-80 font-medium">Net Tax Liability</p>
                  <h1 className="text-6xl font-black mt-2">
                    {/* Note the data.results.total_tax path */}₹
                    {data.results?.total_tax?.toLocaleString("en-IN") || "0"}
                  </h1>
                  <div className="mt-6 inline-flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-full text-sm">
                    <ShieldCheck className="w-4 h-4" /> Optimized for FY 2026-27
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <p className="text-gray-500 text-sm font-medium">
                    Taxable Income
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{data.summary?.net_taxable?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <p className="text-gray-500 text-sm font-medium">
                    Surcharge Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {(data.results?.s_rate * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-gray-400">
              Enter income and click compute to see your tax breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorUI;
