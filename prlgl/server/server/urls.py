"""
URL configuration for server project.

The urlpatterns list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.http import HttpResponse
from api.views import reply_dict_error_api
from api.views import reply_dict_no_error_api
from api.views import chatbot_api
from api.views import finding_fictional_institution

def home(request):
    return HttpResponse("Welcome to your Django API server!")

urlpatterns = [
    path('', home, name='home'),
    path('dict-error/', reply_dict_error_api, name='reply_dict_error_api'), 
    path('dict-no-error/', reply_dict_no_error_api, name='reply_dict_no_error_api'),
    path('find-institution/', finding_fictional_institution, name='finding_fictional_institution'),
    path('chatbot-api/', chatbot_api, name='chatbot_api')
]
