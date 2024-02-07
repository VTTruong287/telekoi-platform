#/bin/bash

export REMOTE=$1
export PORT=$2
export TARGET=$3

# Common
ssh -p $PORT $REMOTE "mkdir /home/www"
ssh -p $PORT $REMOTE "mkdir /home/upload"

# Backend
if [ "$TARGET" = "bot" ] || [ "$TARGET" = "all" ]; then
ssh -p $PORT $REMOTE "mkdir /home/www/bot"
  rsync -r --progress -e "ssh -p $PORT" --exclude node_modules ../dist $REMOTE:/home/www/bot
  # ssh -p $PORT $REMOTE "cd /home/www/bot"
  ssh -p $PORT $REMOTE "pm2 start /home/www/bot/dist/pm2.json"
  # ssh $REMOTE "cp /home/www/backend/nginx-backend.conf /etc/nginx/sites-enabled"
fi

echo !!! NOTE !!!
echo Might need to delete default conf in Nginxs sites-enabled folder
