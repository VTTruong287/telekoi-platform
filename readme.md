# Tele Koi Project

## Backend

### Setup
1. Run `yarn install`
2. Set AWS keys in `.env` file after copying from `.env.template`

### VPS
1. Run `npm install -g pm2`
2. Run `pm2 startup`
3. When deploy, run `pm2 start pm2.json`
4. After deploy, run `pm2 save`

### Deploy
- MacOS
sh upload.sh root@104.248.159.116 22 <bot/backend/frontend>
