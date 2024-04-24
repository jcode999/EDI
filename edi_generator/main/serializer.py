from rest_framework import serializers
from .models import BackOfficeType,Invoice

class BackOfficeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackOfficeType
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'