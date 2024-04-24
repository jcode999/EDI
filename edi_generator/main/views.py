
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from .serializer import BackOfficeTypeSerializer,InvoiceSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .generators import mpos
from django.conf import settings
from .models import BackOfficeType
import os
# Create your views here.
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_invoice(request):
    print()
    print("in api view: data: ",request.data)
    file_serializer = InvoiceSerializer(data=request.data)
    
    if file_serializer.is_valid():
        instance = file_serializer.save()
        path = instance.invoice.path
        print(path)
        if request.data['backofficetype_id'][0]=='1':
            response = mpos.dfw_parser(path)
            
        # time.sleep(2)
        return response
    else:
        print(file_serializer," invalid")
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getBackOfficeTypes(request):
    backOfficeTypes = BackOfficeType.objects.all()
    serializer = BackOfficeTypeSerializer(backOfficeTypes,many=True)
    return Response(serializer.data ,status=status.HTTP_200_OK)


