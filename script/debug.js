if (!localStorage.getItem("debug")) {
    localStorage.setItem("debug", "0")

}

let debugMode = parseInt(localStorage.getItem("debug"));
  if (debugMode == 1) {
    window.addEventListener('DOMContentLoaded', () => {
        debug()

        function updateDebugWins() {
  const outEl = document.getElementById('debugWins');
  if (!outEl) return;

  const lines = [];
  for (const [key, cfg] of Object.entries(windowConfigs)) {
    const win = document.querySelector(cfg.selector);
    const hidden = !win || win.classList.contains('hidden');
    lines.push(`${key}: ${hidden ? 'hidden' : 'widać'}`);
  }

  outEl.style.whiteSpace = 'pre';
  outEl.style.fontFamily = 'monospace, monospace';
  outEl.textContent = lines.join('\n');
}

updateDebugWins();

const _open = openWindow;
openWindow = function (name, extra) {
  _open(name, extra);
  updateDebugWins();
};

const _close = closeWindow;
closeWindow = function (sel, iconFn) {
  _close(sel, iconFn);
  updateDebugWins();
};

const _toggle = toggleMaximize;
toggleMaximize = function (sel) {
  _toggle(sel);
  updateDebugWins();
};

    });
  }
const consoles = [];

const methods = [
  "log",
  "info",
  "warn",
  "error",
  "debug",
  "trace",
  "table",
  "group",
  "groupCollapsed",
  "groupEnd",
  "time",
  "timeEnd",
  "timeLog",
  "dir",
  "dirxml",
  "count",
  "countReset",
  "assert",
  "clear"
];

const originals = {};

const colors = {
  log: "#ccc",
  info: "#00bfff",
  warn: "#ff9800",
  error: "#f44336",
  debug: "#9c27b0",
  trace: "#009688",
  table: "#4caf50",
  group: "#2196f3",
  groupCollapsed: "#2196f3",
  groupEnd: "#2196f3",
  time: "#8bc34a",
  timeEnd: "#8bc34a",
  timeLog: "#8bc34a",
  dir: "#e91e63",
  dirxml: "#e91e63",
  count: "#795548",
  countReset: "#795548",
  assert: "#ff5722",
  clear: "#607d8b"
};

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", { hour12: false }); 
}

function getCallerPosition() {
  const err = new Error();
  const stack = err.stack ? err.stack.split("\n") : [];
  const caller = stack[3] || "";
  const match = caller.match(/(\w+\.js:\d+:\d+)/);
  return match ? match[1].replace(/:\d+$/, "") : "unknown";
}

function writeToDebugConsole(entry) {
  const container = document.getElementById("debugConsole");
  if (!container) return;

  const line = document.createElement("div");
  line.style.color = colors[entry.method] || "#fff";
  line.style.fontFamily = "monospace";
  line.style.whiteSpace = "pre-wrap";

  let text = `[${entry.timestamp}] ${entry.method.toUpperCase()} (${entry.position}): `;
  const formattedArgs = entry.args.map(arg => {
    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return "[Unserializable Object]";
      }
    }
    return String(arg);
  }).join(" ");

  line.textContent = text + formattedArgs;
  container.appendChild(line);
}

methods.forEach(method => {
  if (typeof console[method] === "function") {
    originals[method] = console[method].bind(console);

    console[method] = function (...args) {
      const entry = {
        method,
        args,
        timestamp: formatTime(),
        position: getCallerPosition()
      };

      consoles.push(entry);
      writeToDebugConsole(entry);

      const debug = localStorage.getItem("debug");
      if (debug === "1") {
        return originals[method](...args);
      }
    };
  }
});


const debugBtn = document.querySelector('.debugBtn');
if (debugBtn) {
    debugcolor(debugMode);
}

function debugcolor(debugMode) {
    if (!debugBtn) return;

    if (debugMode === 1) {
        debugBtn.textContent = 'Debug: Włączone';
        debugBtn.style.background = 'rgba(0, 143, 36, 1)';
    } else if (debugMode === 0) {
        debugBtn.textContent = 'Debug: Wyłączone';
        debugBtn.style.background = 'rgba(192, 0, 0, 1)';
    }
}

function toglDebug() {
    let currentPref = parseInt(localStorage.getItem("debug"));
    const newPref = currentPref === 1 ? 0 : 1;

    localStorage.setItem("debug", newPref.toString());
    debugcolor(newPref);
    window.location.reload()
}