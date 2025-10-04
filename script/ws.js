// --- WebSocket Client Module (Independent) ---
class WSClient {
  constructor(serverUrl = 'wss://firepro.edu.pl/ws/') {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.onMessageCallback = null;
    this.connected = false;
    this.connectingPromise = null;
    this.username = null;

    this.connect();
  }

  async connect() {
    if (this.connectingPromise) return this.connectingPromise;

    this.connectingPromise = new Promise(async (resolve) => {
      this.username = await NameResolver.resolveName(); // get your username from resolver
      console.log(this.username)

      this.ws = new WebSocket(this.serverUrl);

      this.ws.addEventListener('open', () => {
        console.log('WS connected as', this.username);
        this.connected = true;
        this.ws.send(JSON.stringify({ type: 'register', username: this.username }));
        resolve();
      });

      this.ws.addEventListener('message', (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'message' && this.onMessageCallback) {
            // trigger only messages addressed to me
            if (data.to === this.username) {
              this.onMessageCallback(data.from, data.payload);
            }
          } else if (data.type === 'system' || data.type === 'error') {
            console.log('WS system:', data.message);
          }
        } catch (err) {
          console.error('Invalid JSON:', ev.data);
        }
      });

      this.ws.addEventListener('close', () => {
        console.log('WS closed, reconnecting...');
        this.connected = false;
        setTimeout(() => this.connect(), 1000);
      });

      this.ws.addEventListener('error', (err) => {
        console.error('WS error', err);
        this.ws.close();
      });
    });

    return this.connectingPromise;
  }

  async sendMessage(to, payload) {
    if (!this.connected) await this.connectingPromise;
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'message', from: this.username, to, payload }));
      return true;
    } else {
      console.warn('WS not open');
      return false;
    }
  }

  onMessage(callback) { this.onMessageCallback = callback; }
}

// --- Usage ---
const wsClient = new WSClient();

// Listen for messages addressed to self
wsClient.onMessage((from, payload) => {
  console.log(`Message from ${from}:`, payload);
});

// Async helper to send messages (waits for connection)
async function testWs(toName, data) {
  if (!wsClient) {
    console.warn('WebSocket client not initialized');
    return false;
  }
  const sent = await wsClient.sendMessage(toName, data);
  console.log(`Message sent to ${toName}?`, sent);
  return sent;
}

// --- Example ---
// testWs('test', { text: 'Hello test!' });
console.log('Gitt')