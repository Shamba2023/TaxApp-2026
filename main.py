from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Import the new restructured classes
from tax_logic import (
    TaxEngine2026, 
    SalaryIncome, 
    HousePropertyIncome, 
    BusinessProfessionIncome, 
    CapitalGainsIncome, 
    OtherSourcesIncome
)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This must match what the Frontend sends
class TaxInputRequest(BaseModel):
    gross_salary: float = 0.0
    rental_income: float = 0.0
    business_income: float = 0.0
    capital_gains: float = 0.0
    other_income: float = 0.0
    nps_corporate: float = 0.0

engine = TaxEngine2026()

@app.post("/calculate")
async def calculate_tax_api(data: TaxInputRequest):
    try:
        # 1. Instantiate the Heads of Income
        salary = SalaryIncome(gross_salary=data.gross_salary)
        house = HousePropertyIncome(rental_income=data.rental_income)
        business = BusinessProfessionIncome(net_profit=data.business_income)
        capital = CapitalGainsIncome(stcg_taxable=data.capital_gains)
        others = OtherSourcesIncome(interest_income=data.other_income)

        # 2. Compute Net for each head (applying their specific deductions)
        salary_net = salary.compute()
        house_net = house.compute()
        business_net = business.compute()
        capital_net = capital.compute()
        others_net = others.compute()

        # 3. Sum up for Gross Total Income
        gti = salary_net + house_net + business_net + capital_net + others_net

        # 4. Final calculation via Engine
        results = engine.compute_tax(gti, nps_80ccd2=data.nps_corporate)

        return {
            "summary": {
                "salary_net": salary_net,
                "house_net": house_net,
                "total_gross_income": gti,
                "nps_deduction": data.nps_corporate,
                "net_taxable": max(0, gti - data.nps_corporate)
            },
            "results": results
        }
    except Exception as e:
        # This will show you the exact error in Render logs if it fails again
        print(f"Error during calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- SERVING THE FRONTEND ---
base_dir = os.path.dirname(os.path.abspath(__file__))
dist_path = os.path.join(base_dir, "frontend", "dist")

if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        file_path = os.path.join(dist_path, full_path)
        if full_path != "" and os.path.exists(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
