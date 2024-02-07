const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const RELEASE_DIR = path.join(__dirname, '../dist');

console.log('Building...');

exec(`npx ncc build ./src/bot.ts -o ${RELEASE_DIR}`, function (err, stdout) {
  console.log(stdout);
  
  if (err) {
    console.error(err);
  }

  fs.copyFileSync(path.join(process.cwd(), '/scripts/pm2.json'), path.join(RELEASE_DIR, 'pm2.json'));
  fs.copyFileSync(path.join(process.cwd(), '.env'), path.join(RELEASE_DIR, '.env'));
  console.log('Build completed!');
});

