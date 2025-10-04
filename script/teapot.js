const viewportCanvas = document.getElementById('potcanv');
const viewportCtx = viewportCanvas.getContext('2d');

const RENDER_WIDTH = 240;
const RENDER_HEIGHT = 160;

const renderCanvas = document.createElement('canvas');
renderCanvas.width = RENDER_WIDTH;
renderCanvas.height = RENDER_HEIGHT;
const renderCtx = renderCanvas.getContext('2d');

let vertices = [];
let faces = [];
let angleX = 0;
let angleY = 0;

let speedX = 0;
let speedY = -0.022;

let frames = 0;
let fps = 0;
let lastFpsUpdate = performance.now();

function resizeViewport() {
    viewportCanvas.width = window.innerWidth;
    viewportCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeViewport);
resizeViewport();

async function loadOBJ(url) {
    const res = await fetch(url);
    const objText = await res.text();
    const verts = [];
    const faceArr = [];

    objText.split('\n').forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (!parts[0]) return;
        if (parts[0] === 'v') verts.push({ x: parseFloat(parts[1]), y: parseFloat(parts[2]), z: parseFloat(parts[3]) });
        else if (parts[0] === 'f') faceArr.push(parts.slice(1).map(i => parseInt(i) - 1));
    });

    vertices = verts;
    faces = faceArr;
}

function rotateY(p, t) {
    const cos = Math.cos(t), sin = Math.sin(t);
    return { x: p.x * cos - p.z * sin, y: p.y, z: p.x * sin + p.z * cos };
}
function rotateX(p, t) {
    const cos = Math.cos(t), sin = Math.sin(t);
    return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}

function project(p, width, height, scale) {
    const factor = scale / (scale + p.z);
    return { x: p.x * factor + width / 2, y: -p.y * factor + height / 2 };
}

function normalizeModel() {
    if (!vertices.length) return;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    vertices.forEach(v => {
        if (v.x < minX) minX = v.x; if (v.x > maxX) maxX = v.x;
        if (v.y < minY) minY = v.y; if (v.y > maxY) maxY = v.y;
        if (v.z < minZ) minZ = v.z; if (v.z > maxZ) maxZ = v.z;
    });

    const scaleX = RENDER_WIDTH * 0.8 / (maxX - minX);
    const scaleY = RENDER_HEIGHT * 0.8 / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (minX + maxX) / 2;
    const offsetY = (minY + maxY) / 2;
    const offsetZ = (minZ + maxZ) / 2;

    vertices = vertices.map(v => ({
        x: (v.x - offsetX) * scale,
        y: (v.y - offsetY) * scale,
        z: (v.z - offsetZ) * scale
    }));
}

function computeNormal(face, verts) {
    const v0 = verts[face[0]];
    const v1 = verts[face[1]];
    const v2 = verts[face[2]];
    const U = { x: v1.x - v0.x, y: v1.y - v0.y, z: v1.z - v0.z };
    const V = { x: v2.x - v0.x, y: v2.y - v0.y, z: v2.z - v0.z };
    return {
        x: U.y * V.z - U.z * V.y,
        y: U.z * V.x - U.x * V.z,
        z: U.x * V.y - U.y * V.x
    };
}

function draw(timestamp) {
    renderCtx.fillStyle = '#111';
    renderCtx.fillRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT);

    const rotated = vertices.map(v => rotateX(rotateY(v, angleY), angleX));
    const projected = rotated.map(v => project(v, RENDER_WIDTH, RENDER_HEIGHT, Math.max(RENDER_WIDTH, RENDER_HEIGHT)));

    renderCtx.strokeStyle = '#0f0';
    renderCtx.beginPath();
    faces.forEach(face => {
        // const normal = computeNormal(face, rotated);
        // if (normal.z < 0) {
        for (let i = 0; i < face.length; i++) {
            const a = face[i], b = face[(i + 1) % face.length];
            renderCtx.moveTo(projected[a].x, projected[a].y);
            renderCtx.lineTo(projected[b].x, projected[b].y);
        }
        // }
    });
    renderCtx.stroke();

    angleX += speedX;
    angleY += speedY;

    frames++;
    if (timestamp - lastFpsUpdate >= 1000) {
        fps = frames; frames = 0; lastFpsUpdate = timestamp;
    }
    renderCtx.fillStyle = '#0f0';
    renderCtx.font = '9px monospace';
    renderCtx.fillText(`FPS: ${fps}`, 5, 15);

    viewportCtx.clearRect(0, 0, viewportCanvas.width, viewportCanvas.height);
    viewportCtx.drawImage(renderCanvas, 0, 0, viewportCanvas.width, viewportCanvas.height);

    requestAnimationFrame(draw);
}

loadOBJ('/newhomev6/home2/teapot.obj').then(() => {
    normalizeModel();
    requestAnimationFrame(draw);
});