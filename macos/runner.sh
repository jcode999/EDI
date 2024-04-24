cd /Users/jigme/projects/EDI
source venv/bin/activate
cd edi_generator
exec python manage.py runserver 0.0.0.0:8000 &
django_pid=$!
echo "Django server PID: $django_pid"

cd ../react-edi
exec npm run dev &
react_pid=$!
echo "React app PID: $react_pid"

