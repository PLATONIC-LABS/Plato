import os
from PyPDF2 import PdfReader
import re
import json
from api.llm import get_completion
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import ast


import tempfile
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.faiss import FAISS

FAISS_INDEX_DIR = "./data/faiss_index"
CHUNK_SIZE = 512
CHUNK_OVERLAP = 128


QNA_TEMPLATE_dict_error = """ Given the following knowledge base as context and the legal rule, examine the following clause with\
and explain why is it flagged because of the error '{error}'.\
Do not refer to external source.:

Context: {context}

Rule: {rule}

Clause: {clause}

Answer: """

QNA_TEMPLATE_dict_no_error = """ Given the following knowledge base as context and the legal rule, examine the following clause with \
and explain why is it flagged as the wrong institution appears in the clause.\
Do not refer to an external source.:

Context: {context}


Clause: {clause}

Answer: """




# Processing PDF files with related clauses
class PDF_base:
    def __init__(self, pdf_file_path):
        self.pdf_file_path = pdf_file_path
        self.pdf_processing()
        
        
    def pdf_processing(self):
        with tempfile.NamedTemporaryFile(delete=False) as f:
            with open(self.pdf_file_path, "rb") as pdf_file:
                f.write(pdf_file.read())
            self.documents = PyMuPDFLoader(f.name).load()
            
    def chunks_pdf_clause(self, clause, top_k = 5):
        """
        This function finds the most relevant sections of the legal knowledge base
        for a given clause using AI-powered semantic search.

        Args:
            clause: The legal clause text to analyze
            top_k: Number of most relevant sections to return (default: 5)

        Returns:
            context: Combined text of the most relevant legal knowledge sections
        """

        # Create an AI model that can understand the meaning of text
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        # Split the large PDF into smaller, manageable chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)

        # Break the legal documents into smaller pieces
        chunked_docs = text_splitter.split_documents(self.documents)

        # Create a searchable database of legal knowledge using AI embeddings
        vector_store = FAISS.from_documents(chunked_docs, embeddings)

        # Save the searchable database for future use
        vector_store.save_local( folder_path=FAISS_INDEX_DIR, index_name= 'sample')

        # Find the most relevant legal knowledge sections for this specific clause
        docs_and_scores = vector_store.similarity_search_with_score(clause, k=top_k)

        # Combine all relevant sections into one context
        context = ""

        if docs_and_scores:
            for doc, score in docs_and_scores:
                context += f"\n{doc.page_content}"

        return context
    
    def genAI_dict_error_response(self,clause,rule, error):
        """
        Generates AI-powered explanations for legal errors found in clauses.

        This function:
        1. Finds relevant legal knowledge for the specific clause
        2. Sends the clause, error, and legal context to GPT-4
        3. Gets back a detailed explanation and suggestion for fixing the error

        Args:
            clause: The legal clause text with the error
            rule: The category of legal rule that was violated
            error: The specific problematic phrase found

        Returns:
            result: Dictionary containing explanation and suggestion for fixing the error
        """

        # Find the most relevant legal knowledge for this specific clause
        context = self.chunks_pdf_clause(clause)

        # Create a detailed prompt for the AI that includes the legal context
        updated_input  = QNA_TEMPLATE_dict_error.format(context=context, rule=rule, clause=clause, error=error)

        # Instructions for the AI on how to behave as a legal assistant
        sys_message = f"""

            As a legal assistant specialized in contract analysis, your role is to assist users in identifying and addressing potential legal issues within contractual clauses. Leveraging a comprehensive knowledge base of legal documents, precedents, and principles, you are expected to:

            1. Analyze and interpret contractual clauses to identify any critical legal issues.
            2. Provide a clear, integrated analysis of the context and the potential legal implications arising from these issues.
            3. Offer concrete, actionable suggestions for amending or clarifying the clause to mitigate legal risks.

            Your responses should be concise, precise, and tailored to non-specialist users, ensuring they are accessible and actionable.

            In instances where a clause is adequately structured and presents no legal concerns, it is important to affirm the clause's validity with a simple 'No issue found.'

            For clauses with identified issues, your response should format as follows:

            {{
                "Context and Legal Implications": "A detailed explanation combining the specific legal issue detected with its potential consequences or risks, providing a comprehensive understanding of the matter at hand.",
                "Suggestion": "Specific advice on how to amend the clause to address the identified issue effectively."
            }}

            This approach ensures users receive both the insight needed to understand the context and potential legal ramifications, along with the guidance necessary to rectify any concerns effectively.
            Example:

            user: ```clause....```

            output if there is no issue with the given clause: ```No issue found```

            output if there is an issue with the given clause:

            [{{
                "Context and legal implications": "The clause does not clearly define the terms of the agreement",
                "Suggestion": "The clause should be rewritten to clearly define the terms of the agreement"
            }}]

        """

        # Prepare the conversation for the AI
        messages = [{"role": "system", "content": sys_message},
                    {"role": "user", "content": updated_input}]

        # Send the request to GPT-4 and get the response
        response = get_completion(messages)

        # Extract the AI's response text
        reply = response.choices[0].message.content

        try:
            # Convert the AI's text response back into a Python dictionary
            result = ast.literal_eval(reply)

        except SyntaxError:
            # Handle cases where the AI response isn't properly formatted
            print("Received a string that is not a valid Python literal.")

        return result
        
        
# Named entity Recognition
def extract_institution(clause):
    """
    Uses AI to identify legal institutions mentioned in a clause.

    This function helps detect if a clause mentions real, recognized arbitration
    institutions or if it mentions fictional/unknown institutions that could
    cause problems in legal proceedings.

    Args:
        clause: The legal clause text to analyze

    Returns:
        reply_new: List of institution names found, or ["No legal institutions found"]
    """
    sys_message = f"""
    You are a legal assistant here to help the user with contract reviewing who is an expert in \
    natural language processing and especially name entity recognition for legal institutions.

    Your task is to identify the institutions specified in the following clause.

    If there is no legal institutions are found within the clause, please respond with 'No legal institutions found'.

    Your responses should be in the list of institutions.

    Example:

    user: ```clause....```

    output if there are legal institutions in the clause:

    ["institution_1", "institution_2", "institution_3"]

    output if there are no legal institutions in the clause:

    ["No legal institutions found"]

    """

    # Send the clause to AI for institution extraction
    messages = [{"role": "system", "content": sys_message},
                {"role": "user", "content": clause}]

    response = get_completion(messages)
    reply = response.choices[0].message.content

    print(reply)

    # Convert AI response from text to Python list
    try:
        reply = ast.literal_eval(reply)

    except ValueError as e:
        print(f"Error evaluating reply: {e}")

    # Filter results to only include properly capitalized institution names
    reply_new = []
    for name in reply:
        for n in name.split():
            if n.istitle():  # Check if word starts with capital letter (proper noun)
                reply_new.append(name)
                break
    if len(reply_new) == 0:
        reply_new = ["No legal institutions found"]

    return reply_new
        
        
        
# Chatbot
class Chatbot:
    """
    A general-purpose legal chatbot that can answer questions about legal concepts.

    This provides a way for users to ask general legal questions beyond just
    clause analysis, making the application more helpful for learning and
    understanding legal concepts.
    """
    def __init__(self, knowledge_base = None):
        """
        Initialize the chatbot with optional knowledge base.

        Args:
            knowledge_base: Optional additional legal knowledge to reference
        """
        self.knowledge_base = knowledge_base

    def handle_query(self, user_question):
        """
        Process a user's legal question and provide an AI-generated response.

        Args:
            user_question: The legal question from the user

        Returns:
            reply_content: AI-generated answer to the legal question
        """
        system_message = "You are a legal assistant here to help us with clause review and checking concept."
        messages = [
            {'role': 'system', 'content': system_message},
            {'role': 'user', 'content': user_question},
            {'role': 'system', 'content': self.knowledge_base}
        ]
        # Send question to AI and get response
        response = get_completion(messages=messages)
        reply_content = response.choices[0].message.content
        return reply_content

    def update_knowledge_base(self, term, explanation):
        """
        Add new legal knowledge to the chatbot's knowledge base.

        Args:
            term: Legal term or concept
            explanation: Detailed explanation of the term
        """
        self.knowledge_base[term] = explanation
        
        
