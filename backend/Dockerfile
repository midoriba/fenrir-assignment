FROM python:3.10-buster

ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --upgrade pip \
  && pip install -r requirements.txt