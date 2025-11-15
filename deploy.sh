sudo git pull && sudo npm run build
pm2 stop dist/main.js
pm2 restart dist/main.js
# pm2 logs