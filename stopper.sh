#!/bin/bash

# Find and kill Django processes
echo "Stopping Django app..."
pids=$(ps aux | grep '[p]ython manage.py runserver' | awk '{print $2}')
if [ -n "$pids" ]; then
    kill $pids
    echo "Django app stopped successfully."
else
    echo "Django app is not running."
fi