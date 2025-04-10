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
        
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)

        chunked_docs = text_splitter.split_documents(self.documents)

        vector_store = FAISS.from_documents(chunked_docs, embeddings)

        vector_store.save_local( folder_path=FAISS_INDEX_DIR, index_name= 'sample')
        
        docs_and_scores = vector_store.similarity_search_with_score(clause, k=top_k)
        
        context = ""
        
        if docs_and_scores:
            for doc, score in docs_and_scores:
                context += f"\n{doc.page_content}"
                
        return context
    
    def genAI_dict_error_response(self,clause,rule, error):
        
        # here is where the knowledge base is
        context = self.chunks_pdf_clause(clause)
        
        updated_input  = QNA_TEMPLATE_dict_error.format(context=context, rule=rule, clause=clause, error=error)
        
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
        
        messages = [{"role": "system", "content": sys_message},
                    {"role": "user", "content": updated_input}]
        
        response = get_completion(messages)
        
        reply = response.choices[0].message.content
        
        try:
            # Assuming 'reply' is the variable holding the string to be evaluated
            result = ast.literal_eval(reply)

        except SyntaxError:
            # Handle the error: log it, return a meaningful error message, etc.
            print("Received a string that is not a valid Python literal.")
        
        return result
        
        
# Named entity Recognition
def extract_institution(clause):
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
    
    messages = [{"role": "system", "content": sys_message},
                {"role": "user", "content": clause}]
    
    response = get_completion(messages)
    reply = response.choices[0].message.content
    
    print(reply)

    # Error handling
    try:
        reply = ast.literal_eval(reply)

    except ValueError as e:
        print(f"Error evaluating reply: {e}")
    
    reply_new = []
    for name in reply:
        for n in name.split():
            if n.istitle():
                reply_new.append(name)
                break
    if len(reply_new) == 0:
        reply_new = ["No legal institutions found"]
    
    return reply_new
        
        
        
# Chatbot
class Chatbot:
    def __init__(self, knowledge_base = None):
        self.knowledge_base = knowledge_base
        
    def handle_query(self, user_question):
        system_message = "You are a legal assistant here to help us with clause review and checking concept."
        messages = [
            {'role': 'system', 'content': system_message},
            {'role': 'user', 'content': user_question},
            {'role': 'system', 'content': self.knowledge_base}
        ]
        response = get_completion(messages=messages)
        reply_content = response.choices[0].message.content
        return reply_content
    
    def update_knowledge_base(self, term, explanation):
        self.knowledge_base[term] = explanation
        
        
