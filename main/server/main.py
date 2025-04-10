from crewai import Agent, Task, Crew, Process, LLM
import os
import json
import logging
from dotenv import load_dotenv
from fpdf import FPDF
import streamlit as st

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def get_llm(llm_type="openai"):
    """Configure the LLM for CrewAI agents using native CrewAI LLM class"""
    return LLM(
        model="openai/gpt-4o-mini",
        api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0.2
    ) 

def load_json_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def create_info_gathering_agent(llm, rental_details):
    return Agent(
        role="Information Gatherer",
        goal="Process and validate the provided rental information",
        backstory="I am an expert at collecting and validating rental agreement information",
        verbose=True,
        tools=[],
        llm=llm,
        context=f"Working with rental details: {json.dumps(rental_details, indent=2)}"
    )

def create_rent_agreement_crew(llm_type="openai", rental_details=None):
    llm = get_llm(llm_type)
    
    # Load JSON data
    compliance_data = load_json_data('data/compliance_rules.json')
    audit_data = load_json_data('data/audit.json')
    jurisdictional_data = load_json_data('data/jurisdictional_rules.json')
    
    # Add info gathering agent with rental details context
    info_gatherer = create_info_gathering_agent(llm, rental_details)
    
    legal_specialist = Agent(
        role="Legal Specialist",
        goal="Ensure agreement complies with jurisdiction-specific laws",
        backstory="I am a legal specialist with expertise in rental law across multiple jurisdictions",
        verbose=True,
        tools=[],
        llm=llm,
        context=f"""
        Jurisdictional rules: {json.dumps(jurisdictional_data, indent=2)}
        Rental details: {json.dumps(rental_details, indent=2)}
        """
    )
    
    contract_drafter = Agent(
        role="Legal Contract Drafter",
        goal="Draft a comprehensive rent agreement following legal requirements",
        backstory="I am an expert legal document drafter specializing in rental agreements",
        verbose=True,
        tools=[],
        context=f"""
        Using compliance rules: {compliance_data}
        Rental details: {json.dumps(rental_details, indent=2)}
        """,
        llm=llm
    )
    
    contract_reviewer = Agent(
        role="Legal Document Reviewer",
        goal="Review and finalize the rent agreement ensuring all requirements are met",
        backstory="I am a legal document reviewer ensuring compliance and completeness",
        verbose=True,
        tools=[],
        context=f"""
        Using audit requirements: {audit_data}
        Rental details: {json.dumps(rental_details, indent=2)}
        """,
        llm=llm
    )
    
    # Modify task descriptions to include rental details
    gather_info_task = Task(
        description=f"""
        Process and validate the following rental information:
        {json.dumps(rental_details, indent=2)}
        Ensure all required fields are present and valid.
        """,
        expected_output="Validated rental information in JSON format",
        agent=info_gatherer
    )
    
    jurisdictional_check_task = Task(
        description="Review agreement for jurisdiction-specific compliance",
        expected_output="Compliance report and required modifications",
        agent=legal_specialist
    )
    
    draft_task = Task(
        description="Draft a rent agreement following legal requirements and best practices",
        expected_output="Complete rent agreement text content",
        agent=contract_drafter
    )
    
    review_task = Task(
        description="Review and finalize the rent agreement ensuring compliance",
        expected_output="Final validated rent agreement ready for PDF generation",
        agent=contract_reviewer
    )
    
    crew = Crew(
        agents=[info_gatherer, legal_specialist, contract_drafter, contract_reviewer],
        tasks=[gather_info_task, jurisdictional_check_task, draft_task, review_task],
        verbose=True,
        process=Process.sequential
    )
    
    return crew

def generate_pdf(content):
    # Clean content by removing asterisks
    content = content.replace('*', '')
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Split content into lines and add to PDF
    lines = content.split('\n')
    for line in lines:
        pdf.multi_cell(0, 10, txt=str(line))
    
    # Save the PDF
    output_path = "output/rent_agreement.pdf"
    pdf.output(output_path)
    return output_path, content

def create_rent_agreement(rental_details):
    try:
        # Create required directories
        os.makedirs("output", exist_ok=True)
        
        # Pass rental_details to create_rent_agreement_crew
        crew = create_rent_agreement_crew(rental_details=rental_details)
        result = crew.kickoff()
        
        # Log the type and content of result for debugging
        logger.info(f"CrewAI Output Type: {type(result)}")
        logger.info(f"CrewAI Output Content: {result}")
        
        # Convert result to string if needed
        if hasattr(result, 'raw_output'):
            content = str(result.raw_output)
        elif not isinstance(result, str):
            content = str(result)
        else:
            content = result
            
        return content
    except Exception as e:
        logger.error(f"Error creating rent agreement: {e}")
        raise

def main():
    st.title("Rental Agreement Generator")
    
    # Initialize session state
    if 'pdf_path' not in st.session_state:
        st.session_state.pdf_path = None
    if 'contract_content' not in st.session_state:
        st.session_state.contract_content = None
    if 'rental_details' not in st.session_state:
        st.session_state.rental_details = None
    
    # Load jurisdictions
    try:
        jurisdictional_data = load_json_data('data/jurisdictional_rules.json')
        jurisdictions = list(jurisdictional_data.keys())
    except Exception as e:
        st.error(f"Error loading jurisdictions: {e}")
        return

    # Create form for rental details
    with st.form("rental_details_form"):
        landlord_name = st.text_input("Landlord Name")
        tenant_name = st.text_input("Tenant Name")
        property_address = st.text_input("Property Address")
        rent_amount = st.number_input("Monthly Rent Amount", min_value=0.0, step=100.0)
        lease_term = st.number_input("Lease Term (months)", min_value=1, step=1)
        jurisdiction = st.selectbox("Jurisdiction", jurisdictions)
        
        submitted = st.form_submit_button("Generate Agreement")
        
        if submitted:
            if not all([landlord_name, tenant_name, property_address, rent_amount, lease_term]):
                st.error("Please fill in all fields")
                return
                
            rental_details = {
                "landlord_name": landlord_name,
                "tenant_name": tenant_name,
                "property_address": property_address,
                "rent_amount": rent_amount,
                "lease_term": lease_term,
                "jurisdiction": jurisdiction
            }
            
            try:
                with st.spinner("Generating rental agreement..."):
                    st.session_state.contract_content = create_rent_agreement(rental_details)
                    st.session_state.rental_details = rental_details
            except Exception as e:
                st.error(f"Error generating agreement: {e}")

    # Display contract content and confirmation
    if st.session_state.contract_content:
        st.subheader("Preview Your Rental Agreement")
        
        # Display contract in a text area with scrolling
        st.text_area("Contract Preview", 
                    value=st.session_state.contract_content,
                    height=400,
                    disabled=True)
        
        # Add confirmation button
        if st.button("Confirm and Generate PDF"):
            try:
                with st.spinner("Generating PDF..."):
                    pdf_path, _ = generate_pdf(st.session_state.contract_content)
                    st.session_state.pdf_path = pdf_path
                st.success("PDF generated successfully!")
            except Exception as e:
                st.error(f"Error generating PDF: {e}")

    # Display download button if PDF was generated
    if st.session_state.pdf_path and os.path.exists(st.session_state.pdf_path):
        with open(st.session_state.pdf_path, "rb") as pdf_file:
            pdf_bytes = pdf_file.read()
            st.download_button(
                label="Download Rental Agreement",
                data=pdf_bytes,
                file_name="rental_agreement.pdf",
                mime="application/pdf"
            )

if __name__ == "__main__":
    main()