from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
from main import create_rent_agreement
import logging

app = FastAPI()

class ContractRequest(BaseModel):
    user_prompt: str

class RentalDetails(BaseModel):
    landlord_name: str
    tenant_name: str
    property_address: str
    rent_amount: str
    security_deposit: str
    lease_term: str
    start_date: str

class ContractResponse(BaseModel):
    message: str
    required_fields: Optional[List[str]] = None
    contract_path: Optional[str] = None

@app.post("/api/initiate-contract")
async def initiate_contract(request: ContractRequest):
    try:
        # Return the required fields for rent agreement
        return ContractResponse(
            message="Please provide the following information",
            required_fields=[
                "landlord_name",
                "tenant_name",
                "property_address",
                "rent_amount",
                "security_deposit",
                "lease_term",
                "start_date"
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-contract")
async def generate_contract(details: RentalDetails):
    try:
        # Convert Pydantic model to dict
        rental_details = details.dict()
        
        # Generate the contract
        contract_path = create_rent_agreement(rental_details)
        
        return ContractResponse(
            message="Contract generated successfully",
            contract_path=contract_path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contract/{contract_id}")
async def get_contract_status(contract_id: str):
    # Implement contract status checking
    return {"status": "completed"}
