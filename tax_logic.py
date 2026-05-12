from dataclasses import dataclass
from typing import Dict

@dataclass
class SalaryIncome:
    """Head 1: Income from Salary"""
    gross_salary: float = 0.0
    standard_deduction: float = 75000.0  # FY 2026-27 New Regime
    professional_tax: float = 0.0

    def compute(self) -> float:
        """Subtracts standard deduction and professional tax from gross salary."""
        return max(0, self.gross_salary - self.standard_deduction - self.professional_tax)

@dataclass
class HousePropertyIncome:
    """Head 2: Income from House Property"""
    rental_income: float = 0.0
    municipal_taxes: float = 0.0
    interest_on_loan: float = 0.0  # Self-occupied or Let-out interest

    def compute(self) -> float:
        """
        Calculates Net Annual Value (NAV) and applies 30% Standard Deduction.
        Formula: (Rental Income - Municipal Taxes) * 70% - Interest on Loan.
        """
        nav = max(0, self.rental_income - self.municipal_taxes)
        standard_deduction = nav * 0.30
        return nav - standard_deduction - self.interest_on_loan

@dataclass
class BusinessProfessionIncome:
    """Head 3: Income from Business or Profession"""
    net_profit: float = 0.0
    presumptive_income: float = 0.0

    def compute(self) -> float:
        return self.net_profit + self.presumptive_income

@dataclass
class CapitalGainsIncome:
    """Head 4: Income from Capital Gains"""
    stcg_taxable: float = 0.0
    ltcg_taxable: float = 0.0

    def compute(self) -> float:
        # Note: Future updates can handle special tax rates (12.5%, 20%, etc.) here.
        return self.stcg_taxable + self.ltcg_taxable

@dataclass
class OtherSourcesIncome:
    """Head 5: Income from Other Sources"""
    interest_income: float = 0.0
    dividends: float = 0.0
    other_earnings: float = 0.0

    def compute(self) -> float:
        return self.interest_income + self.dividends + self.other_earnings

class TaxEngine2026:
    def __init__(self):
        # New Regime Slabs (Finance Act 2025)
        self.slabs = [
            (400000, 0.05),   # 4L - 8L
            (800000, 0.10),   # 8L - 12L
            (1200000, 0.15),  # 12L - 16L
            (1600000, 0.20),  # 16L - 20L
            (2000000, 0.25),  # 20L - 24L
            (2400000, 0.30),  # Above 24L
        ]
        self.REBATE_THRESHOLD = 1200000
        self.CESS_RATE = 0.04

    def compute_tax(self, gross_total_income: float, nps_80ccd2: float = 0) -> Dict:
        # Final Net Taxable Income after 80CCD2 (Corporate NPS)
        net_taxable = max(0, gross_total_income - nps_80ccd2)
        
        # Calculate Base Tax
        base_tax = self._calculate_slab_tax(net_taxable)
        
        # Apply 87A Rebate / Marginal Relief
        tax_after_rebate = self._apply_rebate(net_taxable, base_tax)
        
        # Surcharge (Simplified for New Regime)
        surcharge, s_rate = self._calculate_surcharge(net_taxable, tax_after_rebate)
        
        # Education Cess
        final_tax_before_cess = tax_after_rebate + surcharge
        cess = final_tax_before_cess * self.CESS_RATE
        
        return {
            "total_tax": final_tax_before_cess + cess,
            "base_tax": base_tax,
            "surcharge": surcharge,
            "s_rate": s_rate,
            "cess": cess,
            "rebate_adjustment": base_tax - tax_after_rebate
        }

    def _calculate_slab_tax(self, income: float) -> float:
        tax = 0.0
        if income <= 400000: return 0.0
        
        for i, (limit, rate) in enumerate(self.slabs):
            if income > limit:
                next_limit = self.slabs[i+1][0] if i+1 < len(self.slabs) else float('inf')
                taxable_in_slab = min(income, next_limit) - limit
                tax += taxable_in_slab * rate
            else:
                break
        return tax

    def _apply_rebate(self, income: float, tax: float) -> float:
        if income <= self.REBATE_THRESHOLD:
            return 0.0
        # Marginal Relief: Tax cannot exceed income above 12L
        excess_income = income - self.REBATE_THRESHOLD
        return min(tax, excess_income)

    def _calculate_surcharge(self, income: float, tax: float):
        if income <= 5000000: return 0.0, 0.0
        if income <= 10000000: return tax * 0.10, 0.10
        if income <= 20000000: return tax * 0.15, 0.15
        return tax * 0.25, 0.25 # Capped at 25% for New Regime
