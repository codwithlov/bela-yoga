const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function readPortFromDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env');

  if (!fs.existsSync(envPath)) {
    return undefined;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/^\s*PORT\s*=\s*['"]?(\d+)['"]?\s*$/m);
  return match?.[1];
}

const mode = process.argv[2];
const extraArgs = process.argv.slice(3);

if (!mode || !['dev', 'start'].includes(mode)) {
  console.error('Usage: node scripts/next-with-env-port.cjs <dev|start> [...nextArgs]');
  process.exit(1);
}

const port = process.env.PORT || readPortFromDotEnv() || '3000';
const nextBin = require.resolve('next/dist/bin/next');

const child = spawn(process.execPath, [nextBin, mode, '-p', String(port), ...extraArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: String(port),
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
