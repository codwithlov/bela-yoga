module.exports = {
  apps: [
    {
      name: 'bela-yoga',
      script: 'scripts/next-with-env-port.cjs',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || '3030',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || '3030',
      },
    },
  ],
};