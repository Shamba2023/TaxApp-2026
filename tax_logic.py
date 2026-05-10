from dataclasses import dataclass
import pandas as pd

@dataclass
class IncomeData:
    gross_salary: float = 0.0
    interest_income: float = 0.0
    rental_income: float = 0.0
    other_income: float = 0.0

    def get_total_gross(self):
        return self.gross_salary + self.interest_income + self.rental_income + self.other_income

@dataclass
class DeductionsData:
    standard_deduction: float = 75000.0
    nps_corporate_80ccd2: float = 0.0
    
    def get_total_deductions(self):
        return self.standard_deduction + self.nps_corporate_80ccd2
    

class TaxEngine2026:
    def __init__(self):
        self.REBATE_THRESHOLD = 1200000
        self.CESS_RATE = 0.04
        self.SLABS = [
            (400000, 0.00), (800000, 0.05), (1200000, 0.10),
            (1600000, 0.15), (2000000, 0.20), (2400000, 0.25),
            (float('inf'), 0.30)
        ]

    def _calculate_slab_tax(self, income):
        tax, prev_limit = 0, 0
        for limit, rate in self.SLABS:
            if income > prev_limit:
                taxable_amount = min(income, limit) - prev_limit
                tax += taxable_amount * rate
                prev_limit = limit
            else: break
        return tax

    def _calculate_surcharge(self, income, tax_before_surcharge):
        """Calculates surcharge with marginal relief for high income thresholds."""
        # Surcharge rates for New Regime (Finance Act 2025)
        if income > 20000000: rate, threshold = 0.25, 20000000
        elif income > 10000000: rate, threshold = 0.15, 10000000
        elif income > 5000000: rate, threshold = 0.10, 5000000
        else: return 0.0, 0.0
        
        current_surcharge = tax_before_surcharge * rate
        
        # --- Marginal Relief Logic for Surcharge ---
        # Rule: Tax + Surcharge cannot exceed (Tax at threshold + Surcharge at threshold) + (Income - Threshold)
        
        tax_at_threshold = self._calculate_slab_tax(threshold)
        # Calculate surcharge specifically for the threshold limit to compare
        if threshold == 20000000: threshold_surcharge = tax_at_threshold * 0.15
        elif threshold == 10000000: threshold_surcharge = tax_at_threshold * 0.10
        else: threshold_surcharge = 0 # No surcharge at 50L exactly
            
        max_total_tax_allowed = (tax_at_threshold + threshold_surcharge) + (income - threshold)
        current_total_tax = tax_before_surcharge + current_surcharge
        
        if current_total_tax > max_total_tax_allowed:
            # If we are over the limit, the surcharge is adjusted
            # so that (Tax + Adjusted Surcharge) == max_total_tax_allowed
            refined_surcharge = max(0, max_total_tax_allowed - tax_before_surcharge)
            return refined_surcharge, rate
            
        return current_surcharge, rate

    def compute(self, taxable_income):
        # 1. Base Slab Tax
        base_tax = self._calculate_slab_tax(taxable_income)
        
        # 2. 87A Rebate / Marginal Relief (for 12L threshold)
        tax_after_rebate = base_tax
        if taxable_income <= self.REBATE_THRESHOLD:
            tax_after_rebate = 0
        else:
            excess = taxable_income - self.REBATE_THRESHOLD
            if base_tax > excess:
                tax_after_rebate = excess
        
        # 3. Surcharge with corrected logic
        surcharge, s_rate = self._calculate_surcharge(taxable_income, tax_after_rebate)
        
        # 4. Cess
        cess = (tax_after_rebate + surcharge) * self.CESS_RATE
        
        return {
            "taxable_income": taxable_income,
            "base_tax": base_tax,
            "rebate_adjustment": base_tax - tax_after_rebate,
            "surcharge": surcharge,
            "s_rate": s_rate,
            "cess": cess,
            "total_tax": tax_after_rebate + surcharge + cess
        }
    

# --- INPUT SECTION ---
user_income = IncomeData(gross_salary=14500000, interest_income=15000)
user_deductions = DeductionsData(nps_corporate_80ccd2=50000)

# --- PROCESSING ---
total_gross = user_income.get_total_gross()
total_deductions = user_deductions.get_total_deductions()
net_taxable = max(0, total_gross - total_deductions)

engine = TaxEngine2026()
results = engine.compute(net_taxable)

# --- BEAUTIFUL OUTPUT ---
summary_data = {
    "Description": [
        "Gross Total Income", 
        "Total Deductions", 
        "Net Taxable Income",
        "Slab Tax (Before Rebate)",
        "87A Rebate/Relief",
        "Surcharge",
        "Health & Education Cess (4%)",
        "TOTAL TAX PAYABLE"
    ],
    "Amount (₹)": [
        total_gross,
        -total_deductions,
        results['taxable_income'],
        results['base_tax'],
        -results['rebate_adjustment'],
        results['surcharge'],
        results['cess'],
        results['total_tax']
    ]
}

df = pd.DataFrame(summary_data)
# df.style.format({"Amount (₹)": "₹{:,.0f}"})
