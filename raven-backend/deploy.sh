#!/bin/bash
docker build -t raven/raven-api-backend .
docker push raven/raven-api-backend

ssh deploy@$DEPLOY_SERVER << EOF
docker pull raven/raven-api-backend
docker stop api-raven || true
docker rm api-raven || true
docker rmi raven/raven-api-backend:current || true
docker tag raven/raven-api-backend:latest raven/raven-api-backend:current
docker run -d --restart always --name api-raven -p 8080:8080 raven/raven-api-backend:current
EOF
