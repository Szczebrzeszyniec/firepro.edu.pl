const ffstring = `
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⠿⠿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿
  ⣿⣿⡏⠁⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⣶⣶⣶⣶⣦⣤⡄⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿
  ⣿⣿⣷⣄⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡧⠇⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣾⣮⣭⣿⡻⣽⣒⠀⣤⣜⣭⠐⢐⣒⠢⢰⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣏⣿⣿⣿⣿⣿⣿⡟⣾⣿⠂⢈⢿⣷⣞⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣷⣶⣾⡿⠿⣿⠗⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠻⠋⠉⠑⠀⠀⢘⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⡿⠟⢹⣿⣿⡇⢀⣶⣶⠴⠶⠀⠀⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⡿⠀⠀⢸⣿⣿⠀⠀⠣⠀⠀⠀⠀⠀⡟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠹⣿⣧⣀⠀⠀⠀⠀⡀⣴⠁⢘⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿
  ⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⠗⠂⠄⠀⣴⡟⠀⠀⡃⠀⠉⠉⠟⡿⣿⣿⣿⣿
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠾⠛⠂⢹⠀⠀⠀⢡⠀⠀⠀⠀⠀⠙⠛⠿⢿
    FireShell v0.67

  Host: ${location.hostname || 'local'}
  UA:   ${navigator.userAgent}
  Platform: ${navigator.platform}
`;
//   let debugMode = parseInt(localStorage.getItem("debug"));
function ie(link) { openWindow('ie', link); }
function set() { openWindow('set');toglSety('tapeta'); }
function kod() { openWindow('kod'); }
function help() { openWindow('help'); }
function ph() { openWindow('ph'); }
function ser() { openWindow('ser'); }
function inf() { openWindow('inf'); }
function link() { openWindow('link'); }
function pot() { openWindow('pot'); }
function ping() { openWindow('ping'); }
function prog() { openWindow('prog'); }
function cmd() { openWindow('cmd');}
function debug() { openWindow('debug');}
function multi() { openWindow('multi');}

function maxie() { toggleMaximize('.iewindow'); }
function maxset() { toggleMaximize('.setwindow'); }
function maxpot() { toggleMaximize('.potwindow'); }
function maxhelp() { toggleMaximize('.helpwindow'); }
function maxcmd() { toggleMaximize('.cmdwindow'); }

function closeie() { closeWindow('.iewindow', ie); }
function closeset() { closeWindow('.setwindow', set); }
function closekod() { closeWindow('.kodwindow', kod); }
function closehelp() { closeWindow('.helpwindow', help); }
function closeph() { closeWindow('.phwindow', ph); }
function closeser() { closeWindow('.serwindow', ser); }
function closeinf() { closeWindow('.infwindow', inf); }
function closelink() { closeWindow('.linkwindow', link); }
function closepas() { closeWindow('.paswindow'); }
function closepot() { closeWindow('.potwindow', pot); }
function closewarn() { closeWindow('.warnwindow'); }
function closeping() { closeWindow('.pingwindow', ping); }
function closeprog() { closeWindow('.progwindow', prog); }
function closecmd() { closeWindow('.cmdwindow', cmd);}
function closedebug() { closeWindow('.debugwindow', debug);}
function closewinfn() { closeWindow('.winfnwindow'); }
function closemulti() { closeWindow('.multiwindow'); }

function pas() {
    return new Promise((resolve) => {
        console.warn('pas')
        const window = document.querySelector('.paswindow')
        const tbarname = document.querySelector('#tbarnamepas')
        const passin = document.getElementById('passin')
        const master = document.querySelector('.freespace')
        const smenu = document.querySelector('.smenu')

        console.log(master.clientWidth)

        if (!smenu.classList.contains('hidden')) {
            smenu.classList.add('hidden')
        }

        if (window.classList.contains('hidden')) {
            passin.value = ''
            window.classList.remove('hidden')
            tbarname.textContent = `hasło`
            window.style.height = '78px'
            window.style.width = '240px'
            window.style.position = 'absolute'
            window.style.zIndex = 999
            window.style.top = `${((master.clientHeight / 2))}px`
            window.style.left = `${((master.clientWidth / 2) - 120)}px`

            const y = document.querySelector('#passy')
            const n = document.querySelector('#passn')

            y.addEventListener('click', () => {
                let pass = passin.value
                resolve(pass);
                closepas()
            })

            n.addEventListener('click', () => {
                resolve('%nopas');
                closepas()
            })

        }
    });
}

function warn(msg) {
    return new Promise((resolve) => {
        console.warn('pas')
        const window = document.querySelector('.warnwindow')
        const tbarname = document.querySelector('#tbarnamewarn')
        const text = document.getElementById('warntext')
        const master = document.querySelector('.freespace')
        const smenu = document.querySelector('.smenu')

        if (!smenu.classList.contains('hidden')) {
            smenu.classList.add('hidden')
        }

        if (window.classList.contains('hidden')) {
            window.classList.remove('hidden')
            tbarname.textContent = `powiadomienie`
            window.style.height = '78px'
            window.style.width = '220px'
            window.style.position = 'absolute'
            window.style.zIndex = 999
            window.style.top = `${((master.clientHeight / 2))}px`
            window.style.left = `${((master.clientWidth / 2) - 120)}px`

            if (msg) {
                text.textContent = msg
            } else {
                text.textContent = 'undefined'
            }

        }
    });
}

function winFnetLogin() {
  return new Promise((resolve) => {
    console.warn('winfn');

    const winEl = document.querySelector('.winfnwindow');
    const tbarname = document.querySelector('#tbarnamewinfn');
    const unamein = document.getElementById('unamein');
    const passwdin = document.getElementById('passwdin');
    const master = document.querySelector('.freespace');
    const smenu = document.querySelector('.smenu');

    if (!winEl) {
      console.error('Login window element not found (.winfnwindow)');
      return resolve(null);
    }

    if (!smenu.classList.contains('hidden')) {
      smenu.classList.add('hidden');
    }

    if (winEl.classList.contains('hidden')) {
      if (unamein) passwdin.value = '';
      if (passwdin) passwdin.value = '';

      winEl.classList.remove('hidden');
      tbarname && (tbarname.textContent = 'logowanie');
      winEl.style.height = '84px';
      winEl.style.width = '250px';
      winEl.style.position = 'absolute';
      winEl.style.zIndex = '999';

      const top = Math.max(20, Math.round(master.clientHeight / 2 - 54));
      const left = Math.max(10, Math.round(master.clientWidth / 2 - 120));
      winEl.style.top = `${top}px`;
      winEl.style.left = `${left}px`;

      const okBtn = document.querySelector('#winfnok');
      if (!okBtn) {
        console.error('OK button not found (#winfnok)');
        return resolve(null);
      }

      okBtn.addEventListener('click', function handler() {
        const username = (unamein && unamein.value) ? unamein.value.trim() : '';
        const password = (passwdin && passwdin.value) ? passwdin.value : '';

        closewinfn?.();

        resolve({ username, password });
      }, { once: true });
    } else {
      const okBtn = document.querySelector('#winfnok');
      if (!okBtn) return resolve(null);

      okBtn.addEventListener('click', function handler() {
        const username = (unamein && unamein.value) ? unamein.value.trim() : '';
        const password = (passwdin && passwdin.value) ? passwdin.value : '';
        closewinfn?.();
        resolve({ username, password });
      }, { once: true });
    }
  });
}



const windowConfigs = {
    ie: {
        selector: '.iewindow',
        titleSelector: '#tbarname',
        icon: ie,
        defaultTitle: (link) => `Internet - ${link}`,
        size: { w: 960, h: 640 },
        position: { x: 40, y: 40 },
        center: false,
        setSrc: true
    },
    set: {
        selector: '.setwindow',
        titleSelector: '#tbarnameset',
        icon: set,
        defaultTitle: 'Ustawienia',
        size: { w: 640, h: 520 }
    },
    kod: {
        selector: '.kodwindow',
        titleSelector: '#tbarnamekod',
        icon: kod,
        defaultTitle: 'Kod podarunkowy',
        size: { w: 420, h: 90 }
    },
    help: {
        selector: '.helpwindow',
        titleSelector: '#tbarnamehelp',
        icon: help,
        defaultTitle: 'Pomoc',
        size: { w: 420, h: 320 }
    },
    ph: {
        selector: '.phwindow',
        titleSelector: '#tbarnameph',
        icon: ph,
        defaultTitle: 'placeholder',
        size: { w: 420, h: 320 },
        position: { x: 0, y: 0 },
        center: false
    },
    ser: {
        selector: '.serwindow',
        titleSelector: '#tbarnameser',
        icon: ser,
        defaultTitle: 'Serwer - informacje sprzętowe',
        size: { w: 480, h: 340 },
        position: { right: 34, bottom: 34 },
        center: false
    },
    inf: {
        selector: '.infwindow',
        titleSelector: '#tbarnameinf',
        icon: inf,
        defaultTitle: 'Informacje',
        size: { w: 420, h: 320 }
    },
    link: {
        selector: '.linkwindow',
        titleSelector: '#tbarnamelink',
        icon: link,
        defaultTitle: 'Linki',
        size: { w: 480, h: 340 },
        // position: { x: 300, y: 300 },
        center: true
    },
    pas: {
        selector: '.paswindow',
        titleSelector: '#tbarnamepas',
    },
    pot: {
        selector: '.potwindow',
        titleSelector: '#tbarnamepot',
        icon: pot,
        defaultTitle: 'CPU dzban - 240x160 - VSYNC',
        size: { w: 420, h: 334 },
        // position: { x: 0, y: 0 },
        center: true
    },

    ping: {
        selector: '.pingwindow',
        titleSelector: '#tbarnameping',
        icon: ping,
        defaultTitle: 'Śieć - urządzenia',
        size: { w: 280, h: 340 },
        // position: { x: 0, y: 0 },
        center: true
    },

    prog: {
        selector: '.progwindow',
        titleSelector: '#tbarnameprog',
        icon: prog,
        defaultTitle: 'Oprogramowanie',
        size: { w: 480, h: 340 },
        // position: { x: 300, y: 300 },
        center: true
    },

    warn: {
        selector: '.warnwindow',
        titleSelector: '#tbarnamewarn',
        center: true
    },
    cmd: {
        selector: '.cmdwindow',
        titleSelector: '#tbarnamecmd',
        icon: cmd,
        defaultTitle: 'wiersz poleceń',
        size: { w: 500, h: 400 },
        // position: { x: 0, y: 0 },
        center: true
    },
    debug: {
        selector: '.debugwindow',
        titleSelector: '#tbarnamedebug',
        // icon: ph,
        defaultTitle: 'DEBUG',
        size: { w: 480, h: 520 },
        // position: { x: 0, y: 0 },
        // position: { left: 34, bottom: 34 },
        center: false
    },
    winfn: {
        selector: '.winfnwindow',
        titleSelector: '#tbarnamewinfn',
    },
    multi: {
        selector: '.multiwindow',
        titleSelector: '#tbarnamemulti',
        // icon: ph,
        defaultTitle: 'multiplayer',
        size: { w: 420, h: 320 },
        // position: { x: 0, y: 0 },
        center: true
    },
};

const tbEntries = {
    ie: { tbId: 'ietbico', winSel: '.iewindow' },
    set: { tbId: 'settbico', winSel: '.setwindow' },
    kod: { tbId: 'kodtbico', winSel: '.kodwindow' },
    help: { tbId: 'helptbico', winSel: '.helpwindow' },
    ph: { tbId: 'phtbico', winSel: '.phwindow' },
    ser: { tbId: 'sertbico', winSel: '.serwindow' },
    inf: { tbId: 'inftbico', winSel: '.infwindow' },
    link: { tbId: 'linktbico', winSel: '.linkwindow' },
    pot: { tbId: 'pottbico', winSel: '.potwindow' },
    ping: { tbId: 'pingtbico', winSel: '.pingwindow' },
    prog: { tbId: 'progtbico', winSel: '.progwindow' },
    cmd: { tbId: 'cmdtbico', winSel: '.cmdwindow' }
};


function openWindow(name, extraParam) {
    const cfg = windowConfigs[name];
    if (!cfg) return console.warn(`bez conf ${name}`);
  if (debugMode == 1) {
    console.warn(`${name}`);

  }

    const win = document.querySelector(cfg.selector);
    const titleEl = document.querySelector(cfg.titleSelector);
    const smenu = document.querySelector('.smenu');

    if (!smenu.classList.contains('hidden')) {
        smenu.classList.add('hidden');
    }

    if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        if (cfg.icon) tbicon(cfg.icon);

        titleEl.textContent =
            typeof cfg.defaultTitle === 'function'
                ? cfg.defaultTitle(extraParam)
                : cfg.defaultTitle;

        win.style.height = cfg.size.h + 'px';
        win.style.width = cfg.size.w + 'px';
        win.style.position = 'absolute';

        const master = document.querySelector('.freespace');

        if (cfg.center !== false && master) {
            win.style.top = `${(master.clientHeight - cfg.size.h) / 2}px`;
            win.style.left = `${(master.clientWidth - cfg.size.w) / 2}px`;
        }

        if (cfg.position) {
            if ('x' in cfg.position) win.style.left = cfg.position.x + 'px';
            if ('y' in cfg.position) win.style.top = cfg.position.y + 'px';
            if ('right' in cfg.position) win.style.right = cfg.position.right + 'px';
            if ('bottom' in cfg.position) win.style.bottom = cfg.position.bottom + 'px';
        }

        if (cfg.setSrc && extraParam) {
            const frame = document.querySelector('#ieframe');
            if (frame) frame.src = extraParam;
        }
    }
}

function toggleMaximize(selector) {
    const windowEl = document.querySelector(selector);
    const ref = document.querySelector('.freespace');
    if (!windowEl || !ref) return;

    if (!windowEl._maximized) {
        windowEl._prev = {
            width: windowEl.style.width || windowEl.offsetWidth + 'px',
            height: windowEl.style.height || windowEl.offsetHeight + 'px',
            top: windowEl.style.top || windowEl.offsetTop + 'px',
            left: windowEl.style.left || windowEl.offsetLeft + 'px'
        };

        const refRect = ref.getBoundingClientRect();

        windowEl.style.width = refRect.width + 'px';
        windowEl.style.height = refRect.height + 'px';
        windowEl.style.top = '0px';
        windowEl.style.left = '0px';

        windowEl._maximized = true;
    } else {
        const prev = windowEl._prev;
        if (!prev) return;

        windowEl.style.width = prev.width;
        windowEl.style.height = prev.height;
        windowEl.style.top = prev.top;
        windowEl.style.left = prev.left;

        windowEl._maximized = false;
    }
}

function closeWindow(selector, iconFn) {
    const win = document.querySelector(selector);
    if (!win) return;
    win.classList.add('hidden');
    if (typeof iconFn === 'function') tbicon(iconFn);
}

let isDragging = false;
let offsetX = 0, offsetY = 0;
let activeWindow = null;
let baseZIndex = 10;
let zCounter = baseZIndex;

function bringToFront(win) {
    zCounter++;
    win.style.zIndex = zCounter;
}

function startDrag(e, win) {
    e.preventDefault();
    isDragging = true;
    activeWindow = win;

    bringToFront(win);
    cur.src = "/newhomev6/home2/assets/mover.png";

    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.style.pointerEvents = 'none';
    });

    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e) {
    if (!isDragging || !activeWindow) return;

    const parent = activeWindow.parentElement;
    const parentRect = parent.getBoundingClientRect();

    let newLeft = e.clientX - parentRect.left - offsetX;
    let newTop = e.clientY - parentRect.top - offsetY;

    newLeft = Math.max(0, Math.min(newLeft, parent.clientWidth - activeWindow.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, parent.clientHeight - activeWindow.offsetHeight));

    activeWindow.style.left = newLeft + 'px';
    activeWindow.style.top = newTop + 'px';
}

function onMouseUp() {
    isDragging = false;
    activeWindow = null;
    cur.src = "/newhomev6/home2/assets/cursor.png";

    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.style.pointerEvents = 'auto';
    });

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function initWindowDragging() {
    Object.values(windowConfigs).forEach(cfg => {
        const win = document.querySelector(cfg.selector);
        if (!win) return;

        win.addEventListener('mousedown', () => bringToFront(win));

        const toolbar = win.querySelector(`[class$="tbar"]`);
        if (toolbar) {
            toolbar.addEventListener('mousedown', e => startDrag(e, win));
        }
    });
}

const originalOpenWindow = openWindow;
openWindow = function (name, extraParam) {
    originalOpenWindow(name, extraParam);
    const cfg = windowConfigs[name];
    if (!cfg) return;
    const win = document.querySelector(cfg.selector);
    if (win) bringToFront(win);
};

initWindowDragging();

function tbicon(program) {

    let key = typeof program === 'string' ? program : null;

    if (!key && typeof window !== 'undefined') {
        for (const k of Object.keys(tbEntries)) {
            if (window[k] === program) {
                key = k;
                break;
            }
        }
    }

    if (!key || !(key in tbEntries)) {
        return;
    }

    const { tbId, winSel } = tbEntries[key];
    const tbEl = document.getElementById(tbId);
    const winEl = document.querySelector(winSel);

    if (!tbEl) {
        return;
    }

    const shouldShow = winEl ? !winEl.classList.contains('hidden') : false;
    tbEl.style.display = shouldShow ? 'block' : 'none';
  if (debugMode == 1) {
    console.log((shouldShow ? 'poka ' : 'zchowaj ') + key);

  }
}

function getTopWindow() {
    let topWin = null;
    let highestZ = -Infinity;

    Object.values(windowConfigs).forEach(cfg => {
        const win = document.querySelector(cfg.selector);
        if (win && !win.classList.contains('hidden')) {
            const z = parseInt(win.style.zIndex || 0, 10);
            if (z > highestZ) {
                highestZ = z;
                topWin = win;
            }
        }
    });

    return topWin;
}
