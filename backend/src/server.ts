import app from './app';

const { PORT = 4000, NODE_ENV, SELF_PING_URL } = process.env;

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: 4000`);

  // Start self-ping only in production
  if (NODE_ENV === 'production' && SELF_PING_URL) {
    startSelfPing(SELF_PING_URL);
  }
});

function startSelfPing(url: string) {
  const https = require('https');
  const interval = 10 * 60 * 1000; // 10 minutes

  console.log(`Self-ping enabled: Pinging ${url} every 10 minutes.`);

  const ping = () => {
    https
      .get(url, (res: any) => {
        console.log(`[Self-ping] Status: ${res.statusCode}`);
      })
      .on('error', (err: Error) => {
        console.error(`[Self-ping error] ${err.message}`);
      });
  };

  ping(); // Run immediately on startup
  setInterval(ping, interval);
}
