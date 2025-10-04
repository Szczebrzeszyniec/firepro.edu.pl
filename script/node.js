function mbar(percent, length = 34, label = '') {
    const filled = Math.round((percent / 100) * length);
    return '' + '█'.repeat(filled) + '░'.repeat(length - filled) + ` ${label}`;
}

function sdohms(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h}h ${m}m ${s}s`;
}

function formatst(stats) {
    const lines = [];

    lines.push(`${stats.cpu.model}`);
    lines.push(`rdzenie: ${stats.cpu.cores}`);
    lines.push(`taktowanie: ${stats.cpu.speed} GHz`);
    lines.push(`uptime: ${sdohms(stats.cpu.uptime)}`);
    if (stats.cpu.temperature !== null) {
        lines.push(`temperatura: ${stats.cpu.temperature}°C`);
    }

    const totalLoad = stats.cpu.load.perCore.reduce((a, b) => a + b, 0) / stats.cpu.load.perCore.length;
    lines.push(`CPU: ${mbar(totalLoad, 34)}`);
    stats.cpu.load.perCore.forEach((load, i) => {
        lines.push(`rdzeń ${i}: ${mbar(load, 34)}`);
    });

    lines.push('----------------------------------------------------');

    const ramPercent = (stats.memory.used / stats.memory.total) * 100;
    const ramTotalLabel = `${(stats.memory.total / (1024 ** 3)).toFixed(1)} GB`;
    lines.push(`RAM: ${mbar(ramPercent, 34, ramTotalLabel)}`);
    lines.push(`wolne: ${(stats.memory.free / (1024 ** 3)).toFixed(2)} GB`);
    lines.push(`zram: ${(stats.memory.cached / (1024 ** 3)).toFixed(2)} GB`);

    lines.push('----------------------------------------------------');


    stats.disks.forEach(d => {
        const percent = (d.used / d.size) * 100;
        const sizeLabel = `${(d.size / (1024 ** 3)).toFixed(0)} GB`;
        lines.push(`${d.mount} ${mbar(percent, 34, sizeLabel)}`);
    });

    lines.push('----------------------------------------------------');

    stats.network.forEach(n => {
        lines.push(`${n.iface} (${n.operstate}) ↓ ${(n.rx_sec / 1024).toFixed(1)} KB/s ↑ ${(n.tx_sec / 1024).toFixed(1)} KB/s`);
        lines.push(`RX: ${(n.rx / (1024 ** 2)).toFixed(1)} MB  TX ${(n.tx / (1024 ** 2)).toFixed(1)} MB`);
    });

    return lines.join('\n');
}

async function fetchSystemStats() {
    try {
        const res = await fetch('https://firepro.edu.pl/fstat');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        document.getElementById('sipre').textContent = formatst(data);
    } catch (err) {
        console.error(err);
    }
}

fetchSystemStats();
setInterval(fetchSystemStats, 2000);

async function wake(deviceName) {
    try {
        const password = await pas();

        const res = await fetch('https://firepro.edu.pl/wol/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device: deviceName, password })
        });

        if (!res.ok) {
            warn('nieprawidłowe hasło');
            throw new Error(`${res.status}`);
        } else {
            warn(`włącza sie ${deviceName}`);
        }

        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}


async function restart() {
    const password = await pas();
    try {
        const res = await fetch('https://firepro.edu.pl/restart/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (!res.ok) {
            warn('nieprawidłowe hasło')
            const errData = await res.json();
            console.error(errData);
            return errData;
        } else {
            warn('serwer sie restartuje')

        }

        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

let lastData = null;

async function pingnet() {
    const url = 'https://firepro.edu.pl/ping/';
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const jsonString = JSON.stringify(data);

        if (jsonString !== lastData) {
            // console.clear();
            // console.log("update", data);
            lastData = jsonString;
        }

        if (data) {
            czekon('fx506', data);
            czekon('t480', data);
            czekon('ps3', data);
            czekon('ox790', data);
        }

    } catch (err) {
        console.error("Error fetching:", err);
    }
}

function czekon(komp, data) {
    const el = document.getElementById(`${komp}stat`);
    const btn = document.getElementById(`${komp}wol`);
    if (!el) return;

if (data[komp]?.online) {
    el.textContent = 'włączony';
    el.style.color = 'green';
    // console.log(data[komp])

    if (btn.id !== "ps3wol") {
        btn.classList.add('bdisabled');
    }


    } else {
        el.textContent = 'wyłączony';
        el.style.color = 'red';
            if (btn.id !== "ps3wol") {
        btn.classList.remove('bdisabled')
    }

    }
}

setInterval(pingnet, 1000);
pingnet();


const NameResolver = (() => {
  let name = null;

  async function resolveName(activeNames = []) {
    if (name) return name;

    try {
      const userData = await getAllUserData();
      if (userData?.profile?.username) {
        name = userData.profile.username;
        return name;
      }
    } catch (e) {}

    let attempts = 0;
    do {
      const digits = ('000' + Math.floor(Math.random() * 10000)).slice(-4);
      name = 'random' + digits;
      attempts++;
      if (attempts > 100) break;
    } while (activeNames.includes(name));

    return name;
  }

  function getName() { return name; }

  return { resolveName, getName };
})();



async function multiPlayer(baseUrl, pingMs = 5000, pollMs = 1000) {
  const BASE = baseUrl.replace(/\/+$/, '');

  const stateObj = {
    ip: null,
    pingId: null,
    pollId: null,
    activeHosts: [],
    lastPollTs: null
  };

  async function detectIp() {
    try {
      const r = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
      const data = await r.json();
      return data?.ip || 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  async function post(path, body) {
    try {
      await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } catch (e) {}
  }

  async function getJson(path) {
    try {
      const r = await fetch(BASE + path, { cache: 'no-store' });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  let registered = false;
  async function ensureRegistered() {
    if (registered) return;
    const name = await NameResolver.resolveName(stateObj.activeHosts.map(h => h.name));
    if (!stateObj.ip) stateObj.ip = await detectIp();
    await post('/register', { name, ip: stateObj.ip });
    registered = true;
  }

  async function doPing() {
    if (!registered) await ensureRegistered();
    stateObj.ip = stateObj.ip || await detectIp();
    const name = await NameResolver.getName() || await NameResolver.resolveName(stateObj.activeHosts.map(h => h.name));
    await post('/ping', { name, ip: stateObj.ip, clientTimestamp: Date.now() });
  }

  function startPings() {
    if (stateObj.pingId) return;
    doPing().catch(() => {});
    stateObj.pingId = setInterval(() => doPing().catch(() => {}), pingMs);
  }

  function userCounter(users) {

    document.querySelector('#userCount').textContent = users
    if (users === 0) {
      document.querySelector('#userCount').style.color = 'rgba(192, 0, 0, 1)'

    } else {
      document.querySelector('#userCount').style.color = 'rgba(0, 143, 36, 1)'

    }
  }

  async function doPoll() {
    const json = await getJson('/active');
    if (!Array.isArray(json)) return;
    stateObj.activeHosts = json;
    stateObj.lastPollTs = Date.now();

    const list = document.querySelector('.multiList');
    if (!list) return;

    const myName = await NameResolver.getName() || await NameResolver.resolveName(stateObj.activeHosts.map(h => h.name));
    let users = 0
    list.innerHTML = '';
    stateObj.activeHosts.forEach(h => {
      if (!h?.name || h.name === myName) return;
      const el = document.createElement('button');
      el.textContent = h.name;
      list.appendChild(el);
      users += 1
      el.addEventListener('mouseenter', () => { cur.src = "/newhomev6/home2/assets/pointer.png"; });
      el.addEventListener('mouseleave', () => { cur.src = "/newhomev6/home2/assets/cursor.png"; });
    });
    userCounter(users)
  }

  function startPolling() {
    if (stateObj.pollId) return;
    doPoll().catch(() => {});
    stateObj.pollId = setInterval(() => doPoll().catch(() => {}), pollMs);
  }

  function startAll() { startPings(); startPolling(); }
  function stop() { 
    if (stateObj.pingId) { clearInterval(stateObj.pingId); stateObj.pingId = null; }
    if (stateObj.pollId) { clearInterval(stateObj.pollId); stateObj.pollId = null; }
  }

  function getState() { return { ...stateObj }; }
  function getActive() { return stateObj.activeHosts.slice(); }
  function getLatestPollTs() { return stateObj.lastPollTs; }
  startAll();

  return {
    stop,
    startAll,
    getState,
    getActive,
    getLatestPollTs
  };
}



const client = multiPlayer('https://firepro.edu.pl/phonehome', 1000, 1000);

