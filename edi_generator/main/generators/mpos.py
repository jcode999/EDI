import PyPDF2
import re
import os
import pandas as pd
from ..models import EDI
from django.conf import settings
from django.http import HttpResponse

# Open the PDF file in binary mode
#append leading zeros
def leading_zeros(unit,max_length):
    #6
    lz = '0'* (max_length- len(unit)) 
    return lz + unit
def append_space(description):
    if len(description)< 25:
        return description + (" " *(25 - len(description)))
    return description[0:25]

def edi_generator(df,file_name):
    save_file_path = os.path.join(settings.BASE_DIR,'data',"edi",file_name)
    scan_code = df['Scan Code']
    Description = df['Description']
    cost = df['Cost']
    qty = df['Qty']
    with open(save_file_path,'w') as edi_file:
        edi_file.write('Invoice Number:xxxx\n')
        for i in range(0,len(scan_code)):
            line = 'B'+scan_code[i][0:11] + append_space(Description[i]) + '0'*6 +leading_zeros(cost[i].replace('.',''),6)+ '  '+ '0'*5+'1' + leading_zeros(qty[i],5)+'0'*14+'\n'
            edi_file.write(line)
    instance = EDI()
    instance.edi_file.save(file_name,open(save_file_path,'rb'))
    instance.save()

    file_path = instance.edi_file.path
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/force-download')
        response['Content-Disposition'] = f'attachment; filename="{instance.edi_file.name}"'
        return response
    

def dfw_parser(file_path):
    path = os.path.join(settings.BASE_DIR,'images',file_path)
    file_att = file_path.split('/')
    save_path = os.path.join(settings.BASE_DIR,'data','edi',file_att[len(file_att)-1].split('.')[0])
    print('Reading pdf invoice located at:-',path)
    print('edi file will be saved to: ',save_path)
    
    with open(path, 'rb') as file:
        # Create a PDF reader object
        pdf_reader = PyPDF2.PdfReader(file)

        # Get the number of pages in the PDF
        num_pages = len(pdf_reader.pages)
        text = ''
        
        # Iterate through all pages and extract text
        for page_num in range(num_pages):
            # Get a specific page
            page = pdf_reader.pages[page_num]

            # Extract text from the page
            text = text+page.extract_text()

            # Print the text or do further processing
            # 
        
        lines = text.split('\n')
        # for line in lines:
        #     print(line)
        data_line_pattern = r'^([0-9]*) ([a-zA-Z0-9\s!@#$%^&*()-_+=<>?/,:;\'"\\]*) ([0-9]*) (\d*\.\d+) .*'
        scan_code=[]
        Description=[]
        qty=[]
        cost=[]
        for line in lines:
            matches = re.match(data_line_pattern,line)
            
            if(matches):
                if(len(matches[1])<12):
                    pass
                else:
                    scan_code.append(str(matches[1]))
                    Description.append(matches[2])
                    qty.append(str(matches[3]))
                    cost.append(str(matches[4]))
    
    inv_df = pd.DataFrame({
        'Scan Code':scan_code,
        'Description':Description,
        'Cost':cost,
        'Qty':qty,
    })

    return edi_generator(inv_df,file_att[len(file_att)-1].split('.')[0])
                    



        


                
