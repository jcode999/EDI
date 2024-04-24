cd C:\Users\jigme\projects\EDI
call venv\Scripts\activate
cd edi_generator
start python manage.py runserver 0.0.0.0:8000
echo Django server started.

cd ..\react-edi
start npm run dev
echo React app started.
