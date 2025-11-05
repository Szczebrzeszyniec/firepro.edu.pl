function tele() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}
if (tele()) {
    window.location.href = '231.html'
    console.log('tele fon')
} else {
    console.log("ok komputer");

}
console.log(Date.now())



//  ⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
//  ⠀⠀⠀⠀⠀⢰⡿⠋⠁⠀⠀⠈⠉⠙⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
//  ⠀⠀⠀⠀⢀⣿⠇⠀⢀⣴⣶⡾⠿⠿⠿⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
//  ⠀⠀⣀⣀⣸⡿⠀⠀⢸⣿⣇⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
//  ⠀⣾⡟⠛⣿⡇⠀⠀⢸⣿⣿⣷⣤⣤⣤⣤⣶⣶⣿⠇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀
//  ⢀⣿⠀⢀⣿⡇⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⣿⡏⠀⠀⠀⠀⢴⣶⣶⣿⣿⣿⣆
//  ⢸⣿⠀⢸⣿⡇⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⣿⡇⣀⣠⣴⣾⣮⣝⠿⠿⠿⣻⡟
//  ⢸⣿⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠀
//  ⠸⣿⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀
//  ⠀⠻⣷⣶⣿⣇⠀⠀⠀⢠⣼⣿⣿⣿⣿⣿⣿⣿⣛⣛⣻⠉⠁⠀⠀⠀⠀⠀⠀⠀
//  ⠀⠀⠀⠀⢸⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
//  ⠀⠀⠀⠀⢸⣿⣀⣀⣀⣼⡿⢿⣿⣿⣿⣿⣿⡿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀



const kodpod = document.getElementById('kodpodarunkowy')
const kodpodok = document.getElementById('kodpodok')
const kodpodnie = document.getElementById('kodpodnie')

function kodclear() {
    kodpod.style.color = 'black'
    kodpod.value = ""
    kodpod.blur();
}

kodpod.addEventListener('keydown', function (e) {
    kodpod.style.color = 'black'
    if (e.key === 'Enter') {
        kodck()
    }
})

function kodck() {

    // jak już tak chcesz te kody to masz
    // typ co inspektuje element xpp
    // zinspektuj to se jakieś suczki może
    // taka wskazówka

    let kod = kodpod.value;
    if (kod == 'skamot11') {
        kodpod.style.color = 'rgba(0, 143, 36, 1)'

        window.open('https://www.youtube.com/@skamot1062', '_blank').focus();
        // kodclear()
    } else if (kod == 'SIGMA1') {
        kodpod.style.color = 'rgba(0, 143, 36, 1)'

        window.open('https://www.facebook.com/ECPUPolska/', '_blank').focus();
        // kodclear()
    }
}
















const foty = document.getElementsByTagName('img');

document.addEventListener('contextmenu', event => event.preventDefault());

let systemStats = {}



window.addEventListener('load', () => {
    const gif = document.getElementById('startmvgif');
    if (gif) {
        const src = gif.src;
        gif.src = '';
        gif.src = src;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const startmv = document.querySelector('.startmv');
    if (startmv && startmvpref === 1) {
        setTimeout(() => {
            startmv.classList.add('hidden');
        }, 1400);
    }
});

for (const img of foty) {
    img.setAttribute('draggable', 'false');
}

function openlink(link) {
    window.open(link)
}

function startClock(tct, tcd) {
    function update() {
        const date = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const tct = document.getElementById('tct')
        const tcd = document.getElementById('tcd')

        tct.textContent = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        tcd.textContent = `${pad(date.getDate())}:${pad(date.getMonth() + 1)}:${date.getFullYear()}`;
    }

    update();
    setInterval(update, 1000);
} startClock()

const cur = document.getElementById('cursor');
const desktop = document.querySelector('.desktop');
const taskbar = document.querySelector('.taskbar');
const body = document.body;

cur.style.position = 'fixed';
cur.style.pointerEvents = 'none';
cur.style.display = 'none';
cur.src = '/newhomev6/home2/assets/cursor.png';

let inside = false;

function enter() {
  inside = true;
  body.style.cursor = 'none';
  cur.style.display = 'block';
}
function leave() {
  inside = false;
  body.style.cursor = 'default';
  cur.style.display = 'none';
}


desktop.addEventListener('pointerenter', enter);
desktop.addEventListener('pointerleave', leave);
taskbar.addEventListener('pointerenter', enter);
taskbar.addEventListener('pointerleave', leave);

document.addEventListener('pointermove', (e) => {
  if (!inside) return;
  cur.style.left = `${e.clientX}px`;
  cur.style.top = `${e.clientY}px`;
});

window.addEventListener('mouseout', (e) => {
  const toEl = e.relatedTarget;
  if (!toEl || toEl.tagName === 'IFRAME') leave();
});

window.addEventListener('pointercancel', leave);


const hoverSelectors = [
    'button',
    'input',
    '.icon',
    '.smenuitem',
    '.winctrl',
    '.proflink',
    '.setWalBtn',
    '#opt4by3',
    '#opt16by9',
    '.statbarItem',
];

const moveSelectors = [
    'button',
];


const icons = document.querySelectorAll('.icon');
const bgplane = document.querySelector('.freespace')

icons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        icons.forEach(i => i.style.border = '1px solid rgba(0, 0, 0, 0)');
        icon.style.border = '1px solid grey';
        console.log(icon.textContent);
    });
});


bgplane.addEventListener('click', () => {
    icons.forEach(icon => {
        // console.log('klik na bg')
        icon.style.border = '1px solid rgba(0, 0, 0, 0)'

        const smenu = document.querySelector('.smenu')
        const multiPanel = document.querySelector('.multiPanel')

        if (!smenu.classList.contains('hidden')) {
            smenu.classList.add('hidden')
            // smenu.style.display = "none"
        }
        if (!multiPanel.classList.contains('hidden')) {
            multiPanel.classList.add('hidden')
            // smenu.style.display = "none"
        }
    });
});

icons.forEach(icon => {
    let clickTimeout = null;
    let clickCount = 0;

    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;

        if (clickCount === 1) {
            clickTimeout = setTimeout(() => {
                clickCount = 0;
            }, 800);
        }
        else if (clickCount === 2) {
            icons.forEach(i => i.style.border = '1px solid rgba(0, 0, 0, 0)');
            clearTimeout(clickTimeout);
            clickCount = 0;
            console.log("open", icon.textContent);

            const funcCall = icon.dataset.func;
            if (funcCall) {
                const match = funcCall.match(/^([a-zA-Z_$][\w$]*)\s*\((.*)\)$/);
                if (match) {
                    const funcName = match[1];
                    const argsString = match[2].trim();

                    if (typeof window[funcName] === 'function') {
                        const args = argsString
                            ? argsString.split(',').map(arg => {
                                arg = arg.trim();
                                try {
                                    return JSON.parse(arg);
                                } catch {
                                    return arg.replace(/^['"]|['"]$/g, '');
                                }
                            })
                            : [];

                        window[funcName](...args);
                    }
                }
            }

        }
    });
});

function toglstart() {
    const smenu = document.querySelector('.smenu')

    console.warn('smenu')

    if (smenu.classList.contains('hidden')) {
        smenu.classList.remove('hidden')
        // smenu.style.display = "none"
    } else {
        smenu.classList.add('hidden')
    }
}

const smenu = document.querySelector('.smenu');
smenu.addEventListener('click', (event) => {
    event.stopPropagation();
});

const multiPanel = document.querySelector('.multiPanel');
multiPanel.addEventListener('click', (event) => {
    event.stopPropagation();
});

const style = document.getElementById('style');

function setStyle(pref) {
    style.href = `/newhomev6/home2/css/style${pref}.css`
    console.log(`ekran: ${pref}`)
}

setStyle(localStorage.getItem("display"))
// console.log(localStorage.getItem("display"))

function setDisplay(value) {
    localStorage.setItem("display", value)
    window.location.reload()
}

(() => {
  const savedLogs = [];

  function storeOnly(type, args) {
    savedLogs.push({ type, args: [...args], time: new Date() });
  }

  console.log = (...args) => storeOnly('log', args);
  console.warn = (...args) => storeOnly('warn', args);
  console.error = (...args) => storeOnly('error', args);

  window.getSavedLogs = () => savedLogs;
})();

function toglMultiPanel() {
    const smenu = document.querySelector('.multiPanel')

    console.warn('smenu')

    if (smenu.classList.contains('hidden') && smenu.querySelector('button')) {
        smenu.classList.remove('hidden')
        // smenu.style.display = "none"
    } else {
        smenu.classList.add('hidden')
    }
}

document.querySelectorAll(hoverSelectors.join(',')).forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.src = "/newhomev6/home2/assets/pointer.png";
    });
    el.addEventListener('mouseleave', () => {
        cur.src = "/newhomev6/home2/assets/cursor.png";
    });
});

// document.querySelectorAll(moveSelectors.join(',')).forEach(el => {
//     el.addEventListener('mouseenter', () => {
//         cur.src = "/newhomev6/home2/assets/mover.png";
//     });
//     el.addEventListener('mouseleave', () => {
//         cur.src = "/newhomev6/home2/assets/cursor.png";
//     });
// });









