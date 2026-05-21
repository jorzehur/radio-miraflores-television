#!/bin/bash
cd /home/z/my-project
while true; do
    echo "Starting Next.js server..."
    npx next dev -p 3000 &
    SERVER_PID=$!
    sleep 5
    
    # Keep checking if it's alive
    while kill -0 $SERVER_PID 2>/dev/null; do
        curl -s -o /dev/null http://localhost:3000 --max-time 5 2>/dev/null
        sleep 30
    done
    
    echo "Server died, restarting..."
    kill $SERVER_PID 2>/dev/null
    sleep 2
done
