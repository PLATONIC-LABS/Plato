from django.shortcuts import render
from .services import PDF_base
from .services import extract_institution
from django.http import JsonResponse
from .services import Chatbot
from django.conf import settings
import json
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
@require_http_methods(["POST"])

def reply_dict_error_api(request):
    
    pdf_directory_path = os.path.dirname(os.path.abspath(__file__))
    pdf_filename = 'Knowledge_base.PDF'

    pdf_file_path = os.path.join(pdf_directory_path, pdf_filename)
    if not os.path.exists(pdf_file_path):
        return JsonResponse({"error": f"File {pdf_filename} does not exist."}, status=404)
    
    pdf_bot = PDF_base(pdf_file_path)
    
    data = json.loads(request.body)
    print("Request data parsed successfully.")
    
    clause = data['clause']
    
    error = data['error']
    
    rule = data['rule']
    
    # Use the method to get the rusult in the form of a json file
    result = pdf_bot.genAI_dict_error_response(clause, rule, error)
        
    if result:
        return JsonResponse({'reply': result}, safe=False)
    else:
        return JsonResponse({"error": f"Failed to process PDF file {pdf_filename}."}, status=500)
        
    
# @csrf_exempt
# @require_http_methods(["POST"])
# def reply_dict_error_api(request):
#     # Hardcoded response for testing
#     result = [{
#         "Context and Legal Implications": "This is a test implication.",
#         "Suggestion": "This is a test suggestion."
#     }]
#     return JsonResponse({'reply': result}, safe=False)



@csrf_exempt
@require_http_methods(["POST"])

def reply_dict_no_error_api(request):
    
    
    pdf_directory_path = os.path.dirname(os.path.abspath(__file__))
    pdf_filename = 'Knowledge_base.PDF'

    pdf_file_path = os.path.join(pdf_directory_path, pdf_filename)
    if not os.path.exists(pdf_file_path):
        return JsonResponse({"error": f"File {pdf_filename} does not exist."}, status=404)
    
    pdf_bot = PDF_base(pdf_file_path)
    
    data = json.loads(request.body)
    print("Request data parsed successfully.")
    
    clause = data['clause']
    
    result = pdf_bot.genAI_dict_no_error_response(clause)
        
    if result:
        return JsonResponse({'reply': result}, safe=False)
    else:
        return JsonResponse({"error": f"Failed to process PDF file {pdf_filename}."}, status=500)
    


@csrf_exempt
@require_http_methods(["POST"])

def finding_fictional_institution(request):
    data = json.loads(request.body)
    print("Request data parsed successfully.")
    
    reply = extract_institution(data)
    
    if reply:
        return JsonResponse({'Institutions': reply}, safe=False)
    else:
        return JsonResponse({"error": f"Failed to extract institution from the given text."}, status=500)
    
    

@csrf_exempt
@require_http_methods(["POST"])

def chatbot_api(request):
    try:
        data = json.loads(request.body)
        user_question = data.get('question')
        if not user_question:
            return JsonResponse({'error': 'No question provided.'}, status=400)
        chatbot = Chatbot()
        response = chatbot.handle_query(user_question)
        
        return JsonResponse({'response': response})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
