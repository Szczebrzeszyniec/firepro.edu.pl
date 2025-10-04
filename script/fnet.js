const BASE_URL = 'https://net.firepro.edu.pl';
const STORAGE_KEY = 'fnetToken';

async function saveToken(token, expiresIso = null) {
  const obj = { token, expires: expiresIso || null };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  return obj;
}

function loadToken() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function clearToken() {
  localStorage.removeItem(STORAGE_KEY);
}

async function apiFetch(path, opts = {}) {
  const url = (BASE_URL || '') + path;
  const tokenObj = loadToken();
  const headers = Object.assign({}, opts.headers || {}, {
    'Accept': 'application/json'
  });
  if (tokenObj && tokenObj.token) {
    headers['Authorization'] = `Bearer ${tokenObj.token}`;
  }
  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, Object.assign({}, opts, { headers }));
  const contentType = res.headers.get('content-type') || '';
  let body = null;
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    const err = new Error(`API error ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function fnetLogin(uname, passwd, temporary = false) {
  if (!uname || !passwd) throw new Error('username and password required');
  const payload = { username: uname, password: passwd, temporary: !!temporary };
  const res = await fetch((BASE_URL || '') + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let body;
    try { body = await res.json(); } catch(e) { body = await res.text(); }
    const err = new Error('Login failed');
      warn && warn('nieprawidłowe dane');
    err.status = res.status;
    err.body = body;
    throw err;
  }

  const data = await res.json();
  await saveToken(data.token, data.expires || null);
  return data;
}

async function getProfile() {
  return apiFetch('/profile', { method: 'GET' });
}


async function getAllUserData() {
  const profile = await getProfile();

  const dataKeys = profile.data ? Object.keys(profile.data) : [];
  if (dataKeys.length === 0) {
    return { profile, data: profile.data || {} };
  }

  const fetches = dataKeys.map(key =>
    apiFetch(`/userdata/${encodeURIComponent(key)}`, { method: 'GET' })
      .then(res => ({ key, ok: true, value: res[key] }))
      .catch(err => ({ key, ok: false, err }))
  );

  const results = await Promise.all(fetches);
  const merged = {};
  for (const r of results) {
    if (r.ok) merged[r.key] = r.value;
    else {
      merged[r.key] = profile.data[r.key];
    }
  }

  return { profile, data: merged };
}

async function fnetLogout() {
  try {
    await apiFetch('/logout', { method: 'POST' });
  } catch (e) {
    console.warn('logout error', e);
  } finally {
    clearToken();
  }

  window.location.reload()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  checkFnet();
});
function handleSmenuClick() {
  userLogin();
}

document.getElementById('smenuImg').addEventListener('click', handleSmenuClick);
async function checkFnet() {
  const tokenObj = loadToken();
  const logoutBtn = document.querySelector('.fnetLogoutBtn');
  const userContainer = document.querySelector('.fnetUser');

  if (tokenObj && tokenObj.token) {
    try {
      await styleUserInfo();
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      if (userContainer) userContainer.classList.remove('hidden');
      console.log('User appears logged in');
    } catch (err) {
      console.warn(err);
      clearToken();
      if (logoutBtn) logoutBtn.classList.add('hidden');
      if (userContainer) userContainer.classList.add('hidden');
    }
  } else {
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (userContainer) userContainer.classList.add('hidden');
    console.log('User not logged in');
  }
}

async function userLogin() {
  try {
    const creds = await winFnetLogin();
    if (!creds || !creds.username || !creds.password) {
      warn && warn('nieprawidłowe dane');
      throw new Error('Missing credentials');
    }
    const res = await fnetLogin(creds.username, creds.password);
    if (!res || !res.token) {
      warn && warn('nieprawidłowe dane');
      throw new Error('Login failed: no token returned');

    }

    await styleUserInfo();
    document.querySelector('.fnetLogoutBtn')?.classList.remove('hidden');
    document.querySelector('.fnetUser')?.classList.remove('hidden');
    warn && warn('git masz loga');

    try {
      const all = await getAllUserData();
      console.log('All user data:', all);
    } catch (e) {
      console.warn('Failed to load user data after login', e);
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function styleUserInfo() {
  try {
    const profile = await getProfile();
    const nameEl = document.getElementById('smenuName');
    const imgEl = document.getElementById('smenuImg');

    const displayName = profile?.displayName || profile?.username || 'Guest';
    if (nameEl) nameEl.textContent = displayName;

    let avatar = profile?.profilePicture;
    document.getElementById('smenuImg').removeEventListener('click', handleSmenuClick);
    if (typeof avatar === 'string' && avatar.startsWith('/')) avatar = `${BASE_URL}${avatar}`;
    if (imgEl) {
      imgEl.src = avatar;
      imgEl.alt = `${displayName} avatar`;
    }
  } catch (err) {
    console.warn('styleUserInfo error', err);
  }
}

