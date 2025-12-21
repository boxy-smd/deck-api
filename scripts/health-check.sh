#!/bin/bash

set -e

HOST=${1:-localhost}
PORT=${2:-3333}
MAX_ATTEMPTS=30
ATTEMPT=0

echo "🔍 Checking health of Deck API at $HOST:$PORT..."

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT+1))
    
    if curl -sf "http://$HOST:$PORT/health" > /dev/null 2>&1; then
        echo "✅ Application is healthy!"
        exit 0
    fi
    
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS - waiting..."
    sleep 2
done

echo "❌ Health check failed after $MAX_ATTEMPTS attempts"
exit 1
