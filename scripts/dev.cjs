const { spawn } = require('child_process');

const server = spawn('node', ['server/index.cjs'], {
  stdio: 'inherit',
  shell: true,
});

const vite = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  server.kill();
  vite.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
