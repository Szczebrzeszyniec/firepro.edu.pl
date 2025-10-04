const bg = document.querySelector('.freespace');
const divWallsy = document.querySelector('.setWallsy');
const smvpbtn = document.querySelector('.smvpbtn');
const startmv = document.querySelector('.startmv');

const defaults = {
    wallpaper: '/newhomev6/home2/wall/winxp-bliss.webp',
    display: '4by3',
    showser: 'no',
    debug: '0',
    startmvpref: '1'
};

for (const key in defaults) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, defaults[key]);
        console.log('bez ustawień :(');
    }
}

const wallpapers = [
    { name: "none", path: "/newhomev6/home2/wall/none.png" },
    { name: "winxp", path: "/newhomev6/home2/wall/winxp-bliss.webp" },
    { name: "macos", path: "/newhomev6/home2/wall/macos-sierra.jpg" },
    { name: "macosold", path: "/newhomev6/home2/wall/macosold.png" },
    { name: "winvista", path: "/newhomev6/home2/wall/winvista.jpg" },
    { name: "winxphd", path: "/newhomev6/home2/wall/winxphd.webp" },
    { name: "win7", path: "/newhomev6/home2/wall/win7.jpg" },
    { name: "kon1", path: "/newhomev6/home2/wall/kon1.jpg" },
    { name: "kot1", path: "/newhomev6/home2/wall/kotserw2.jpg" },
    { name: "zazu1", path: "/newhomev6/home2/wall/zazu1.jpg" },
    { name: "zazu2", path: "/newhomev6/home2/wall/zazu2.webp" },
    { name: "azusa1", path: "/newhomev6/home2/wall/azusa1.webp" }
];

wallpapers.forEach(w => {
        const img = document.createElement('img');
        img.className = 'setWalBtn';
        img.src = w.path;
        img.alt = w.name;
        img.onclick = () => switchWallpaper(w.name);
        divWallsy.appendChild(img);
});

applyWallpaper(localStorage.getItem("wallpaper"));

function applyWallpaper(path) {
    if (path === 'none') {
        bg.style.backgroundImage = 'none';
    } else {
        bg.style.backgroundImage = `url(${path})`;
    }
    localStorage.setItem("wallpaper", path);
}

function switchWallpaper(input) {
    if (!input) input = 'none';
    const wp = wallpapers.find(w => w.name === input || w.path === input);
    const path = wp && wp.path !== 'none' ? wp.path : 'none';
    applyWallpaper(path);
}

const startmvpref = parseInt(localStorage.getItem("startmvpref"));

if (startmvpref === 0 && startmv) {
    startmv.classList.add('hidden');
}

smvpUpdate(startmvpref);

function smvpUpdate(smcolor) {
    if (!smvpbtn) return;
    if (smcolor === 1) {
        smvpbtn.textContent = 'Film startowy: Włączony';
        smvpbtn.style.background = 'rgba(0, 143, 36, 1)';
    } else {
        smvpbtn.textContent = 'Film startowy: Wyłączony';
        smvpbtn.style.background = 'rgba(192, 0, 0, 1)';
    }
}

function toglsmvp() {
    let currentPref = parseInt(localStorage.getItem("startmvpref"));
    const newPref = currentPref === 1 ? 0 : 1;

    localStorage.setItem("startmvpref", newPref.toString());
    smvpUpdate(newPref);
}

function toglSety(panel) {
    const panele = [
        {name: 'tapeta', div: '.setWallsy'},
        {name: 'ekran', div: '.setEkran'},
        {name: 'inne', div: '.setInne'},
        {name: 'info', div: '.setInfo'}
    ]
    panele.forEach(i =>{
        if (panel == i.name) {
            document.querySelector(i.div).classList.remove('hidden')
        } else {
            document.querySelector(i.div).classList.add('hidden')
        }
    });
}

const serPref = localStorage.getItem("showser");
const serPrefBtn = document.querySelector('.serPrefBtn');

if (serPref === 'on') {
    ser();
}

serPrefUpdate(serPref);

function serPrefUpdate(pref) {
    if (!serPrefBtn) return;
    if (pref === 'on') {
        serPrefBtn.textContent = 'Auto Staty: Włączone';
        serPrefBtn.style.background = 'rgba(0, 143, 36, 1)';
    } else {
        serPrefBtn.textContent = 'Auto Staty: Wyłączone';
        serPrefBtn.style.background = 'rgba(192, 0, 0, 1)';
    }
}

function toglSerPref() {
    const currentPref = localStorage.getItem("showser");
    const newPref = currentPref === 'on' ? 'off' : 'on';

    localStorage.setItem("showser", newPref);
    serPrefUpdate(newPref);

    if (newPref === 'on') ser();
}


