from pydantic import BaseModel
from typing import Optional

class RentalDetails(BaseModel):
    # Tenant Details
    tenant_name: str
    tenant_email: str
    tenant_phone: str
    tenant_id_proof: str
    
    # Landlord Details
    landlord_name: str
    landlord_email: str
    landlord_phone: str
    
    # Property Details
    property_address: str
    property_type: str
    unit_number: Optional[str] = None
    
    # Agreement Terms
    rent_amount: float
    security_deposit: float
    lease_start_date: str
    lease_duration: int  # in months
    payment_due_date: int  # day of month
    
    # Additional Terms
    utilities_included: list[str]
    pets_allowed: bool
    jurisdiction: str = "default"  # for jurisdiction-specific rules
