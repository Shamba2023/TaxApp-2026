from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from tax_logic import TaxEngine2026, IncomeData, DeductionsData
from a2wsgi import ASGIMiddleware  # <--- ADD THIS

app = FastAPI()

# This is the wrapper PythonAnywhere needs
wsgi_app = ASGIMiddleware(app) # <--- ADD THIS

# Enable CORS so your React app can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # This allows StackBlitz to "call" your PC
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data structure for the incoming request
class TaxInputRequest(BaseModel):
    gross_salary: float = 0.0
    interest_income: float = 0.0
    rental_income: float = 0.0
    other_income: float = 0.0
    nps_corporate: float = 0.0

engine = TaxEngine2026()

@app.post("/calculate")
async def calculate_tax_api(data: TaxInputRequest):
    try:
        # 1. Map request to your dataclasses
        income = IncomeData(
            gross_salary=data.gross_salary,
            interest_income=data.interest_income,
            rental_income=data.rental_income,
            other_income=data.other_income
        )
        deductions = DeductionsData(nps_corporate_80ccd2=data.nps_corporate)

        # 2. Replicate your logic from the notebook
        total_gross = income.get_total_gross()
        total_deductions = deductions.get_total_deductions()
        net_taxable = max(0, total_gross - total_deductions)

        # 3. Run the engine
        results = engine.compute(net_taxable)

        # 4. Return combined data for the UI
        return {
            "summary": {
                "total_gross": total_gross,
                "total_deductions": total_deductions,
                "net_taxable": net_taxable
            },
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# 1. Keep your @app.post("/calculate") code as it is!

# 2. Add this at the VERY BOTTOM of main.py (after all other routes)
# This tells Python to show your React UI when someone visits the website
if os.path.exists("frontend/dist"):
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    return FileResponse("frontend/dist/index.html")