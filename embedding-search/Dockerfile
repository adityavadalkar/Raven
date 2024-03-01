FROM python:3.9

COPY . .

# set environment variables
ENV PORT 5005

# install python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5005

# gunicorn
CMD ["python3", "run.py"]
