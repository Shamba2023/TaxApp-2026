from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Import your custom logic
from tax_logic import TaxEngine2026, IncomeData, DeductionsData

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaxInputRequest(BaseModel):
    gross_salary: float = 0.0
    interest_income: float = 0.0
    rental_income: float = 0.0
    other_income: float = 0.0
    nps_corporate: float = 0.0

engine = TaxEngine2026()

# --- API ROUTE ---
@app.post("/calculate")
async def calculate_tax_api(data: TaxInputRequest):
    try:
        income = IncomeData(
            gross_salary=data.gross_salary,
            interest_income=data.interest_income,
            rental_income=data.rental_income,
            other_income=data.other_income
        )
        deductions = DeductionsData(nps_corporate_80ccd2=data.nps_corporate)

        total_gross = income.get_total_gross()
        total_deductions = deductions.get_total_deductions()
        net_taxable = max(0, total_gross - total_deductions)

        results = engine.compute(net_taxable)

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

# --- SERVING THE FRONTEND (REACT) ---
# We use absolute paths to ensure Render finds the files
base_dir = os.path.dirname(os.path.abspath(__file__))
dist_path = os.path.join(base_dir, "frontend", "dist")

if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        # If the request is for an API route, don't serve index.html
        if full_path == "calculate":
            return
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    async def welcome():
        return {"message": "API is running, but frontend/dist was not found. Check your build command."}
