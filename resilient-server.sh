#!/bin/bash
cd /home/z/my-project

# Start Next.js
node node_modules/.bin/next start -p 3000 2>/dev/null &
NEXT_PID=$!

# Keep-alive ping every 3 seconds
while kill -0 $NEXT_PID 2>/dev/null; do
    curl -s -o /dev/null http://localhost:3000 --max-time 3 2>/dev/null
    sleep 3
done

# If Next.js dies, restart immediately
echo "Restarting..." >> /tmp/server-restart.log
exec bash $0
