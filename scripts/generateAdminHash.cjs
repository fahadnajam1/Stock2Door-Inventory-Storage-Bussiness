const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node generateAdminHash.cjs <password>');
  process.exit(1);
}

const saltRounds = 12;
bcrypt.hash(password, saltRounds).then((hash) => {
  console.log(hash);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});