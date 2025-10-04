(() => {
  const lineSpace = document.querySelector('.cmdLineSpace');
  const cmdWindow = () => document.querySelector('.cmdwindow');

  let inputString = '';
  let cursorPos = 0;
  let history = [];
  let historyIndex = null;
  let caretVisible = true;
  let caretTimer = null;
  let mode = 'fash';
  let promptType = 'fash';
  let currentColor = '';

  const cmds = [
    { name: 'echo', fn: cmdEcho },
    { name: 'help', fn: cmdHelp },
    { name: 'clear', fn: cmdClear },
    { name: 'color', fn: cmdColor },
    { name: 'js', fn: cmdJs },
    { name: 'fetch', fn: cmdff },
    { name: 'fetch2', fn: cmdff2 },
    { name: 'otori', fn: cmdotori }
  ];

  function getActiveSpan() { return document.getElementById('cmdtext'); }
  function getActiveLineElement() { const s = getActiveSpan(); return s ? s.closest('a') : null; }

  function insertBeforeActive(node) {
    const active = getActiveLineElement();
    const br = document.createElement('br');
    if (currentColor) node.style.color = currentColor;
    if (active && active.parentNode) {
      active.parentNode.insertBefore(node, active);
      active.parentNode.insertBefore(br, active);
    } else {
      lineSpace.appendChild(node);
      lineSpace.appendChild(br);
    }
  }


  function renderActiveInput() {
    const span = getActiveSpan();
    if (!span) return;
    span.textContent = '';
    if (inputString.length === 0) {
      const c = document.createElement('span');
      c.className = 'caret';
      c.textContent = '|';
      c.style.opacity = caretVisible ? '1' : '0';
      c.style.display = 'inline';
      c.style.lineHeight = '14px';
      span.appendChild(c);
      cursorPos = 0;
      return;
    }
    if (cursorPos < 0) cursorPos = 0;
    if (cursorPos > inputString.length) cursorPos = inputString.length;
    const before = document.createElement('span');
    before.className = 'input-before';
    before.textContent = inputString.slice(0, cursorPos).replace(/ /g, '\u00A0');
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.textContent = '|';
    caret.style.opacity = caretVisible ? '1' : '0';
    caret.style.display = 'inline';
    caret.style.lineHeight = '14px';
    const after = document.createElement('span');
    after.className = 'input-after';
    after.textContent = inputString.slice(cursorPos).replace(/ /g, '\u00A0');
    span.appendChild(before);
    span.appendChild(caret);
    span.appendChild(after);
  }

  function startCaret() {
    stopCaret();
    caretTimer = setInterval(() => {
      caretVisible = !caretVisible;
      const c = lineSpace.querySelector('.caret');
      if (c) c.style.opacity = caretVisible ? '1' : '0';
    }, 500);
  }
  function stopCaret() { if (caretTimer) { clearInterval(caretTimer); caretTimer = null; } }

  function cmdWriteLine(text, kind = 'out') {
    const a = document.createElement('a');
    a.className = (kind === 'out') ? 'cmdOut' : 'cmdIn';
    a.textContent = text;
    if (currentColor) a.style.color = currentColor;
    insertBeforeActive(a);
  }

  function addToHistory(fullText) {
    const active = getActiveLineElement();
    const staticIn = document.createElement('a');
    staticIn.className = 'cmdIn';
    staticIn.textContent = (promptType === 'fash') ? `[user@firepro ~]$ ${fullText}` : `<js> ${fullText}`;
    if (currentColor) staticIn.style.color = currentColor;
    if (active && active.parentNode) {
      active.parentNode.insertBefore(staticIn, active);
      active.parentNode.insertBefore(document.createElement('br'), active);
      const next = active.nextSibling;
      active.remove();
      if (next && next.nodeName === 'BR') next.remove();
    } else {
      lineSpace.appendChild(staticIn);
      lineSpace.appendChild(document.createElement('br'));
    }
  }

  function createNewInputLine() {
    const existing = getActiveLineElement();
    if (existing) return;
    const a = document.createElement('a');
    a.className = 'cmdIn cmdNewLine';
    a.textContent = (promptType === 'fash') ? '[user@firepro ~]$ ' : '<js> ';
    if (currentColor) a.style.color = currentColor;
    const span = document.createElement('span');
    span.id = 'cmdtext';
    a.appendChild(span);
    lineSpace.appendChild(a);
    lineSpace.appendChild(document.createElement('br'));
    inputString = '';
    cursorPos = 0;
    historyIndex = null;
    renderActiveInput();
    startCaret();
    a.scrollIntoView({ block: 'end' });
  }

  function cmdReadLine(full, cmdName) {
    if (!full) return '';
    if (!cmdName) return full.trim();
    const t = full.trim();
    if (!t.startsWith(cmdName)) return t.slice(cmdName.length).trim();
    return t.slice(cmdName.length).replace(/^\s+/, '');
  }

  function cmdEcho(full) { const r = cmdReadLine(full, 'echo'); cmdWriteLine(r, 'out'); }
  function cmdHelp() { const names = cmds.map(c => c.name).join(', '); cmdWriteLine(`${names}`, 'out'); }

  function cmdClear() {
    while (lineSpace.firstChild) lineSpace.removeChild(lineSpace.firstChild);
    inputString = '';
    cursorPos = 0;
  }

  function cmdColor(full) {
    const rest = cmdReadLine(full, 'color').trim();
    if (!rest) { cmdWriteLine('usage: color #XXXXXX', 'out'); return; }
    currentColor = rest;
    const anchors = lineSpace.querySelectorAll('a');
    anchors.forEach(a => a.style.color = currentColor);
  }

  function cmdJs(full) {
    const rest = cmdReadLine(full, 'js').trim().toLowerCase();
    if (!rest) {
      mode = 'js';
      promptType = 'js';
      while (lineSpace.firstChild) lineSpace.removeChild(lineSpace.firstChild);
      inputString = '';
      cursorPos = 0;
      cmdWriteLine('komendy js tera piszesz')
      cmdWriteLine('ctrl + c żeby wyjść')
      createNewInputLine();
      return;
    }
    if (rest === 'exit' || rest === 'fash') {
      mode = 'fash';
      promptType = 'fash';
      while (lineSpace.firstChild) lineSpace.removeChild(lineSpace.firstChild);
      inputString = '';
      cursorPos = 0;
      createNewInputLine();
      return;
    }
    cmdWriteLine('usage: js');
  }

  async function evaluateJSInput(jsCode) {
    let result;
    try {
      result = Function(`"use strict"; return (${jsCode})`)();
    } catch (err) {
      try {
        result = (0, eval)(jsCode);
      } catch (err2) {
        throw err2;
      }
    }
    if (result instanceof Promise) result = await result;
    return result;
  }

  async function cmdRun() {
    if (!getActiveSpan()) createNewInputLine();
    const full = inputString;
    history.push(full);
    historyIndex = null;
    addToHistory(full);

    try {
      if (mode === 'fash') {
        const first = full.trim().split(/\s+/)[0] || '';
        if (!first) { createNewInputLine(); return; }
        const entry = cmds.find(c => c.name === first);
        if (!entry) { cmdWriteLine(`fash: ${first}: command not found`, 'out'); createNewInputLine(); return; }
        const res = entry.fn(full);
        if (res instanceof Promise) await res;
        createNewInputLine();
      } else if (mode === 'js') {
        if (full.trim() === 'clear') { cmdClear(); createNewInputLine(); return; }
        const code = full;
        if (!code.trim()) { createNewInputLine(); return; }
        try {
          const val = await evaluateJSInput(code);
          if (val !== undefined) cmdWriteLine(String(val), 'out');
        } catch (err) {
          cmdWriteLine(`js error: ${err && err.message ? err.message : String(err)}`, 'out');
        }
        createNewInputLine();
      }
    } catch (err) {
      cmdWriteLine(`error: ${err && err.message ? err.message : String(err)}`, 'out');
      createNewInputLine();
    }
  }

  function cmdff() {
    cmdClear()
    printf(ffstring);
  }

    function cmdff2() {
    cmdClear()
    printf(ffstring2);
  }

      function cmdotori() {
    cmdClear()
    printf(otori);
  }


  window.printf = function (s) {
    if (typeof s !== 'string') s = String(s);
    const lines = s.split(/\r?\n/);
    lines.forEach(l => cmdWriteLine(l, 'out'));
  };
  window.__cmdWriteLine = cmdWriteLine;

 function initInputHandlers() {
    window.addEventListener('keydown', async (ev) => {
        const topWin = getTopWindow();
        if (!topWin || !topWin.classList.contains('cmdwindow')) return;

        // rest of your existing cmd handling code
        if (ev.ctrlKey && (ev.key === 'c' || ev.key === 'C')) {
            ev.preventDefault();
            if (mode === 'js') {
                addToHistory('^exit');
                mode = 'fash';
                promptType = 'fash';
                while (lineSpace.firstChild) lineSpace.removeChild(lineSpace.firstChild);
                inputString = '';
                cursorPos = 0;
                createNewInputLine();
            } else {
                inputString = '';
                cursorPos = 0;
                renderActiveInput();
            }
            return;
        }

        if (ev.metaKey) return;

        if (ev.ctrlKey && ev.key.toLowerCase() === 'l') {
            ev.preventDefault();
            cmdClear();
            createNewInputLine();
            return;
        }

        if (ev.key === 'Backspace') {
            ev.preventDefault();
            if (inputString.length > 0 && cursorPos > 0) {
                inputString = inputString.slice(0, cursorPos - 1) + inputString.slice(cursorPos);
                cursorPos = Math.max(0, cursorPos - 1);
                renderActiveInput();
            }
            return;
        }

        if (ev.key === 'Delete') {
            ev.preventDefault();
            if (inputString.length > 0 && cursorPos < inputString.length) {
                inputString = inputString.slice(0, cursorPos) + inputString.slice(cursorPos + 1);
                renderActiveInput();
            }
            return;
        }

        if (ev.key === 'Enter') {
            ev.preventDefault();
            await cmdRun();
            return;
        }

        if (ev.key === 'ArrowLeft') { ev.preventDefault(); cursorPos = Math.max(0, cursorPos - 1); renderActiveInput(); return; }
        if (ev.key === 'ArrowRight') { ev.preventDefault(); cursorPos = Math.min(inputString.length, cursorPos + 1); renderActiveInput(); return; }
        if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            if (history.length === 0) return;
            if (historyIndex === null) historyIndex = history.length - 1;
            else historyIndex = Math.max(0, historyIndex - 1);
            inputString = history[historyIndex] || '';
            cursorPos = inputString.length;
            renderActiveInput();
            return;
        }
        if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            if (history.length === 0 || historyIndex === null) return;
            historyIndex = Math.min(history.length - 1, historyIndex + 1);
            inputString = history[historyIndex] || '';
            cursorPos = inputString.length;
            renderActiveInput();
            return;
        }

        if (ev.key === 'Home') { ev.preventDefault(); cursorPos = 0; renderActiveInput(); return; }
        if (ev.key === 'End') { ev.preventDefault(); cursorPos = inputString.length; renderActiveInput(); return; }

        if (ev.key.length === 1 && !ev.altKey) {
            ev.preventDefault();
            inputString = inputString.slice(0, cursorPos) + ev.key + inputString.slice(cursorPos);
            cursorPos++;
            renderActiveInput();
        }
    });

  lineSpace.addEventListener('click', (ev) => {
    const activeLine = getActiveLineElement();
    if (!activeLine) createNewInputLine();
    else {
      const span = getActiveSpan();
      if (!span) return;
      const rect = span.getBoundingClientRect();
      const clickX = ev.clientX - rect.left;
      const approxCharWidth = rect.width / Math.max(1, (inputString.length || 1));
      let pos = Math.floor(clickX / (approxCharWidth || 7));
      if (pos < 0) pos = 0;
      if (pos > inputString.length) pos = inputString.length;
      cursorPos = pos;
      renderActiveInput();
    }
  });
}


  if (!getActiveSpan()) createNewInputLine();
  else {
    const start = getActiveSpan().textContent || '';
    inputString = (start === '|' ) ? '' : start;
    cursorPos = inputString.length;
    renderActiveInput();
    startCaret();
  }

  initInputHandlers();

  window.cmdRun = cmdRun;
  window.cmdWriteLine = cmdWriteLine;
  window.cmdReadLine = cmdReadLine;
  window.cmds = cmds;

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

const ffstring2 = `
  ⠀⠀⢘⠀⡂⢠⠆⠀⡰⠀⡀⢀⣠⣶⣦⣶⣶⣶⣶⣾⣿⣿⡿⢀⠈⢐⠈⠀⠀
  ⠀⠀⠀⡃⠀⡀⣞⡇⢰⠃⣼⣇⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⣰⣻⡀⢸⠀⠀⠀
  ⠀⠀⢐⢀⠀⣛⣽⣇⠘⢸⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⠟⢡⣾⣿⢿⡇⠀⡃⠀⠀
  ⠀⠀⢐⠀⠀⢳⣿⡯⡞⣾⣿⣿⣿⣿⣿⣿⢿⣿⠟⢁⣴⣿⣿⣿⡜⢷⠀⢘⠄⠀
  ⠀⠀⠂⡂⠸⡆⠙⠛⡵⣿⣿⣿⣿⣿⡿⠤⠛⣠⣴⣿⣿⠿⣟⣟⠟⢿⡆⢳⠀⠀
  ⠀⠀⠸⠁⠀⡾⠁⠀⠀⠀⠀⠉⠉⠉⠈⣠⡌⢁⠄⡛⠡⠉⠍⠙⢳⢾⠁⢸⠀⠀
  ⠀⠀⢈⠀⢀⠌⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣷⡎⠙⢬⣳⣪⡯⢜⣷⢸⠂⡈⠄⠀
  ⠀⠀⠐⡀⠀⢣⠀⠀⠀⠀⠀⠀⠀⣴⣿⣾⣷⢿⢻⣅⣌⡯⢛⣿⣿⡞⠠⡁⠂⠀
  ⠀⠀⠀⠄⠀⢉⡀⠀⠀⢀⡠⠤⠼⣇⣳⣿⣿⣟⡜⣿⣿⣿⣿⣿⣿⡇⠸⠡⠀⠀
  ⠀⠀⡀⠅⠀⠃⢀⡀⣿⡹⠗⢀⠛⠥⣺⣿⣿⡝⢹⣸⣿⣿⣿⣿⡏⠠⠰⠈⠐⠀
  ⠠⠈⠀⠄⣀⠀⠀⠸⠻⠦⠀⠀⠀⠀⠀⠉⠐⠀⠘⠻⢹⣿⡿⠃⠀⡀⠕⣈⠡⡄
  ⠀⠀⣴⡀⣬⠁⠀⠀⡁⠂⠀⣀⣀⠔⠌⠤⣀⡀⠀⠀⡈⢸⠪⠀⠀⡌⠤⠈⡀⣠
  ⠀⠀⣿⣿⣾⡇⠀⠀⠀⣴⢫⣾⠃⠠⢰⣶⣴⠶⣿⣦⠀⠀⠀⢄⣂⠀⠀⠰⠀⠙
  ⠀⠀⠉⠛⠛⠀⢀⣴⣿⢗⡟⠡⣄⣀⡀⠀⢀⣤⠞⡅⠀⠁⠀⡾⠀⠀⠠⡗⠀⢀
  ⠀⠀⠀⠀⠀⣴⡿⢋⠔⠃⠀⠀⠍⠙⠉⠈⠑⠁⠂⠀⠀⠀⡡⡁⣠⡼⣸⠅⠀⠘
  ⠀⠀⠀⣼⠛⢡⠔⠁⠐⣆⠀⠀⠀⠀⠀⠀⠀⠀⠁⢀⡔⡞⢛⣿⡿⠃⠏⠀⠀⢠
  ⠀⠀⠀⠈⠗⠀⠀⠀⠀⠘⣷⣀⢀⣀⣀⠀⡀⢀⣌⡧⠂⠀⡞⠛⡟⠀⠀⠀⡠⠜
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠓⠈⠙⠙⠋⠉⠁⠀⠀⠀⠀⠀⠀⠀⡂⠠⠤⢶
    FireShell v0.67

  Host: ${location.hostname || 'local'}
  UA:   ${navigator.userAgent}
  Platform: ${navigator.platform}
`;

const otori = `
⠢⣍⠲⣍⢣⡝⡲⡄⢀⠀⠣⢘⢯⣿⣻⡽⣏⣿⣽⣻⣽⣿⣭⡹⣎⢿⡿⣝⢮⣓⢻⡜⣩⣞⣏⢧⡹⡆⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⡹⢯⡝⡾⣩⠷⣭⢫⡽⣹⢏⣿⣹⢯⣟⡿⣽⢻⣟⡿⣿⣻⠿⣽⢏⡿⣽⣻⢽⣻⠇⠰⠠⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠧⢃⢠⡗⠃⢸⡜⡐⢤
⠱⢌⠳⣌⠳⣜⢣⠓⡄⠀⠀⢃⠎⣼⣷⣻⣽⡶⣧⣻⢼⣎⢷⣳⡽⣎⢿⣻⡮⣽⣎⠶⡿⢤⡛⣶⡱⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⢱⡹⣞⡽⣳⢛⣼⡹⣞⣵⣻⢮⢷⣛⣾⢳⡯⡿⣼⣛⡷⢯⡿⣽⣫⡽⣶⢯⠷⣭⠐⡇⢃⠁⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⠂⣱⠳⣆⠠⡙⢂⣽⢺
⠀⠂⠀⠀⠁⠂⠂⠡⠄⠐⠀⠀⢘⡖⣻⣷⣳⢿⢧⣯⢻⡼⣏⡾⣵⢯⣏⡽⣟⠶⣭⢻⡕⡮⣕⢫⢷⡩⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⢣⢝⡶⣭⣛⠶⣳⠹⣦⣛⢮⣻⡼⢧⡿⣜⣳⣝⣮⡽⣯⣻⣵⣣⣟⣼⢯⣟⡦⢘⣐⡈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡱⣛⡌⢓⢈⣞⢧⣏
⠀⠄⡀⢀⠀⠀⠀⠀⠀⢀⠀⢀⢀⢾⡹⣿⣧⢿⡾⣼⢧⡿⣼⣳⣭⢞⡮⣝⣻⣿⢜⣧⢻⡼⢬⣓⢎⡷⣭⢃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠈⠁⠀⠈⠁⠀⠈⠉⠛⠛⠛⠻⠷⢿⢷⣧⣿⣦⣝⢧⣳⣛⢯⡽⣏⠿⣜⣳⢿⣹⢻⡞⣧⢟⣮⣛⠾⡅⢫⠄⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠲⡝⡶⢃⡴⢯⠙⣺⡼
⣟⣳⡽⣶⢻⣼⣳⣼⡲⢦⡞⣼⣮⣳⣷⣹⣿⣯⢟⣮⢿⣽⣳⣯⢿⡸⣷⡩⢗⣯⣟⡼⣣⡝⡶⣉⣞⣶⣧⣿⠶⠟⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡈⠠⢌⡉⠛⠳⠷⣮⣗⡳⣭⢟⢾⡱⣏⡞⣧⢻⡜⣯⢖⣭⢛⡅⠲⡈⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡟⢠⠳⡙⢡⡼⡹⡉⢧⢈⢿
⣟⣷⣻⣽⣻⣞⡷⣯⢿⣿⣿⢻⣜⣧⢿⣧⢿⣯⣟⢾⣹⣞⡷⢯⣟⡿⣇⠿⣩⢞⣿⡜⣧⣻⣶⡿⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠦⣉⠲⢶⣄⣈⠙⠻⢶⣯⡞⣽⡹⣞⡵⣫⡞⡵⣎⠷⣫⠆⠱⠐⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠋⠀⢘⠆⢡⣾⡑⠡⡅⠈⣇⢚
⡽⢶⣹⢮⣗⣯⣻⡝⣿⠿⣞⣧⡟⣼⣫⢿⣎⣿⣞⣯⢧⣻⣽⢻⡽⡾⣭⢏⡕⠮⣷⣿⠿⠋⠁⠀⠀⢀⣤⠖⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠐⢤⡀⠉⠑⢦⣀⠉⠻⢷⣷⢬⡓⢷⡻⣕⠯⢾⣱⡋⢄⠃⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⠃⠀⠀⣨⣴⣯⠳⡇⢂⢧⣡⣘⣆
⠩⢇⡙⢪⡙⠲⣍⣻⣍⣻⣽⣾⣿⢷⡽⣞⣷⣾⣿⣎⡟⣖⣻⢯⡽⣳⡻⣮⣼⠟⠋⠁⠀⠀⠀⣠⠞⠋⠁⠀⠀⠀⠀⠀⣠⠆⠀⠀⠀⣰⠏⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀⠙⣆⠀⠀⠈⠳⣤⡀⠈⠻⢾⣥⣛⡼⢫⣓⢧⡓⡈⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠟⢁⡄⢀⢜⣿⡟⡼⣇⠣⡘⢞⡶⣼⡼
⠀⠀⠀⠀⠀⠀⠀⣈⣈⣉⣉⣉⡉⠉⠛⠛⣎⠿⣹⣿⡞⣵⢫⣿⣺⣵⣿⠛⠁⠀⠀⠀⠀⢠⡾⠋⠀⢀⠀⢀⠂⠀⣀⣴⣿⠀⠐⢂⡾⠁⠈⠀⠀⠀⠈⡄⠀⠀⠀⠡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢧⠀⠈⢧⠀⠀⠀⠈⢻⣦⡀⠀⠙⠻⣾⣇⡻⢎⢷⠁⡄⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠋⠀⠀⢳⣨⣾⣟⡼⣓⠿⣧⢈⢿⣱⢿⡼
⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⣿⢷⡀⠹⣆⢣⢿⣿⣜⡳⣾⡿⠋⠀⠀⠀⠀⠀⢀⡴⠋⢀⠀⢂⠄⣁⣦⡼⠶⣿⠏⠀⠀⣠⡿⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠈⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣧⠀⠈⣧⠀⠀⠀⠀⠙⣿⣆⠀⠀⠀⠻⡛⢿⣾⡄⠈⡐⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⠁⠀⠀⣴⣻⣿⡉⢾⣱⢯⣻⡽⣆⠎⠙⠛⠚
⠛⠲⣤⣀⡐⠀⠠⠁⡘⠤⡁⢃⠆⡘⢻⣷⠀⢻⡈⠞⣿⣷⠟⠋⠀⠀⠀⠀⠀⠀⠠⠟⠀⠀⣀⣤⠶⢰⡟⠁⠀⢠⡏⠀⠀⣴⣿⠁⠀⠄⠀⠀⠀⠀⠀⠺⣇⠀⠀⠀⠀⢱⡀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢇⠀⠹⣧⠀⠀⢳⡀⠈⠻⣷⡄⠀⠀⠙⢦⡈⠹⢦⣐⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⠠⡀⠀⢾⣽⡿⠙⢧⢹⣯⢞⡵⡇⢽⡆⠈⠀⠀
⠶⣤⡀⠈⠙⠶⣄⡀⠰⠁⠜⡠⢌⡐⠈⠟⣇⠘⣧⣛⡾⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⢼⠋⠁⢰⡿⠀⠀⣠⡟⠀⠀⣼⣿⡇⠀⣼⠃⢠⣤⣤⣤⣤⡜⢿⣤⠄⢄⡀⠄⢷⣤⣤⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⢿⣧⠀⠀⢳⡀⠀⠹⣿⣦⠀⠀⠀⠙⢦⡀⠙⠳⣄⡀⠀⠀⠀⢠⣾⠃⠀⠀⢓⣨⣿⠏⠀⠀⠸⣏⢿⣟⡾⣇⢣⡙⡄⠀⠀
⠀⠀⠙⠳⣤⡀⠈⠙⢦⡀⠂⡐⢂⠔⠡⠈⣽⡄⢸⠟⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⢠⡏⠀⢀⣿⠇⠀⣀⣿⠁⣠⢶⣿⣿⢂⣾⢃⡜⢠⢀⠢⢄⢼⡇⢾⣷⢌⠦⡘⡌⠶⡐⡎⣝⣻⣿⡛⢯⢟⡻⢻⢶⣶⢾⣿⢦⣄⣀⣳⡀⠀⠻⣿⣷⡀⠀⠀⠀⠙⢦⡤⣈⠛⣦⡀⣰⠟⠀⠀⠀⣴⣼⣿⡍⠀⠀⠀⠀⣿⡎⢿⣞⡇⡜⠄⠑⡀⠀
⠀⠀⠀⠀⠀⠙⢦⡀⠀⠙⢦⡀⠂⠌⡑⢀⣺⡿⠋⠀⠀⠀⠀⠀⠀⠀⠆⠀⣼⠈⠀⢀⣿⠁⣀⣾⣿⢀⡾⣽⡯⣁⣲⡿⣿⣿⢸⡏⠴⣌⠢⢬⢑⠺⣜⣯⢸⣿⣞⠰⣍⡜⢧⡱⡝⣦⢽⣿⡜⢧⢮⢵⣋⠾⣿⣫⣿⡯⡼⣿⣹⢛⣓⠶⣿⣿⣷⡄⠀⠀⠀⠈⠳⣌⠲⣄⠹⣟⡠⣆⠀⢈⣶⠟⠀⢷⠀⠀⠀⡀⣿⢿⡜⣯⡇⡜⢧⣤⣱⡀
⠀⠀⠀⠂⠁⠀⠌⢹⡄⠀⠈⢷⡄⠐⢸⡾⠋⠀⠀⠀⡀⠀⠀⠀⠀⡀⠀⣼⡟⠀⢠⣿⣷⠚⡭⣹⣏⢲⢰⣿⠓⣤⡿⣹⢻⣿⢸⡏⡔⢢⡑⣊⠆⡳⢸⣿⡸⢽⣯⢳⡜⣜⢣⢳⣙⢦⡻⢾⣹⣚⠮⣖⣭⡛⣽⡗⣿⣿⣱⢻⣧⡻⣌⡳⡜⣿⣿⡟⢲⢦⣤⣀⠀⠙⣦⡚⠳⡄⠹⣼⣤⡿⠋⠀⠀⠘⣧⠀⠠⠀⣿⢯⣿⡜⣧⢊⣿⢶⡶⣯
⠀⢀⠂⠠⢀⠁⠀⢂⠻⣆⠀⠉⢻⣷⠟⠀⠀⠀⠀⢠⠁⠀⠀⠀⣠⠇⢠⡟⠀⢀⣿⣿⢣⠘⣥⣿⠰⡚⣼⡯⢡⣿⣷⠡⣻⣿⢸⡧⣍⠣⠴⡑⢎⡱⢭⣿⢖⣹⣿⡇⢾⡬⢳⡭⢞⣣⢟⣽⣣⢞⡽⣚⡴⣹⢞⣿⢼⣿⣭⣛⣿⡷⣭⢳⡼⣹⢿⣿⡆⠤⢠⡉⠻⣆⠈⢷⡀⠀⢲⣌⢻⡄⠀⠀⠀⠀⠘⣧⠀⠐⣿⣳⢞⣷⡝⣜⣺⢯⡿⣽
⠀⢀⠂⡐⢠⠈⠠⠀⣃⠝⡻⢷⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀⠟⡆⠀⣼⣿⡿⡀⠯⣴⡏⠔⢣⣿⢇⣿⣿⠇⠀⣿⣿⣽⡗⡬⢓⡹⣘⢣⢣⡹⣿⢎⣸⣿⣟⢦⣙⡳⢎⡽⣚⠼⣺⡵⢎⡷⣋⢾⡱⢯⣿⢺⣿⡷⣭⢿⣿⡗⣯⢽⣧⠿⣿⣿⡘⣄⢻⡄⠈⢧⠀⢳⣄⣾⠟⠀⠹⣆⠀⠀⠀⠀⠸⣆⠀⣿⡽⣞⡿⣿⡐⡉⠉⠛⠛
⠄⠂⠔⠀⢢⠀⠄⠃⠄⠈⣰⡟⠁⡰⠀⠀⠀⠀⠀⠂⠀⠀⠀⣾⠁⠀⠀⠀⠠⢼⣻⡧⣁⠗⣿⢡⢋⣼⣿⣿⣿⠃⠀⠀⢻⣿⣿⣿⢘⠥⡓⣌⢣⢃⡗⣿⡇⣼⣿⡿⢬⢧⣙⠮⡜⣥⢻⣽⣓⢯⠖⡭⢾⡝⣎⣿⣹⣿⣿⡜⣿⣿⣿⢮⣳⢿⣛⣿⣿⡷⣌⢂⢿⡄⠈⢳⡀⠹⡇⠀⠀⠀⢸⡆⠀⠀⠈⠀⢹⡄⣿⡿⣽⣻⡇⣷⡀⠀⠀⣠
⡊⣁⠂⡈⠔⡈⢠⠁⠂⣼⠏⠀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⢱⡏⠀⠀⡘⠀⠀⣏⣿⠅⣏⢸⡟⡠⢃⣿⣿⣿⠃⠀⠀⣀⣨⣿⣿⣿⣮⣶⣽⣤⣧⣭⡘⣿⡗⣾⣷⣿⢣⡗⣜⢫⡜⣥⡿⣿⢮⣙⡏⣜⣿⡹⢦⣿⢸⣿⣷⡹⢿⣿⣿⣟⡼⣻⣿⢼⣿⣿⡜⣌⢻⣷⡀⠌⢳⡄⢻⡄⠀⠀⠈⢷⡀⠀⠁⠀⠀⢻⡼⣿⣿⣽⡧⣹⢷⠀⣴⣳
⠔⡀⠆⡐⢌⠐⠀⠐⣸⠃⠀⣰⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⠁⠠⢁⣮⣿⠈⡵⣺⡏⢔⣻⣿⣿⣃⡤⠶⠛⠉⠉⠹⣿⣿⣇⢦⢣⢭⡙⢻⢿⣿⣿⡟⣻⣽⡆⡿⡌⢷⡸⠴⣻⣿⢣⢚⡴⢋⡿⡜⣱⣿⣹⣿⣷⠹⣿⣿⣿⣿⣜⢧⢿⣏⣿⣿⣟⡴⢻⡎⢷⡐⡆⢹⡄⢻⡄⢀⠀⡈⣷⠀⠀⠀⠀⠰⣷⡿⣿⣾⡧⢽⣠⢻⣾⡟
⠐⡐⠠⠌⡐⡈⠀⡌⠁⠀⣰⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⠀⠀⠀⠀⢂⠌⣾⡷⠈⡵⣿⡃⣾⣽⣿⠋⠁⠀⠀⠀⠀⠀⠀⠹⣿⣿⡸⣂⠧⡙⣆⢣⣿⣿⡇⢸⣿⣧⣿⢘⢧⡚⣱⣿⡟⣢⢣⣹⢾⡗⣩⢼⣿⣿⣿⣏⠳⣿⠏⣿⣿⣏⢮⢿⣟⣾⣿⣿⣜⣻⡏⡜⣷⢹⡀⠹⡄⢻⡄⠂⠀⠘⣧⠀⠀⠀⠀⣿⣷⣻⣿⡗⡵⣱⣿⣧⣀
⠀⠀⢃⠐⡀⠐⡰⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⢀⠈⠄⠢⣽⣇⠃⣶⣿⡱⢃⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣷⢯⡌⡱⢢⣾⣿⣾⠀⠘⣿⣷⣯⢘⡞⣌⣿⣿⠳⡰⢣⡜⣿⡓⢬⣾⣿⣷⣿⠿⡿⣿⢿⣿⣿⣟⢮⣽⣿⣼⣿⣿⡞⣼⣷⡹⢼⣏⣷⠀⠹⡎⢳⡄⠀⠀⠙⣧⠐⠀⢀⣿⣿⣧⠻⢮⣿⣿⣷⡻⣥
⠀⠈⠄⠐⠀⡠⠁⠀⢀⡾⠀⠀⠀⠀⠀⣄⠀⠀⠀⡀⠀⣟⡅⠀⠀⠀⡌⢠⠁⣿⣇⠩⣇⣿⡱⢹⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⡧⣑⣢⡿⠻⠏⠀⢘⣿⣿⡇⣇⢚⣼⣿⡟⡰⢥⠳⣽⡿⠸⣼⣿⡿⢁⣿⡓⣸⡏⠘⠘⣿⡿⣷⣾⣿⣞⣿⣿⡝⣶⣿⣱⣋⢿⣸⣇⠆⢻⡄⢻⣤⠀⠀⠹⣧⠀⣰⣿⣿⠫⣽⢿⡟⣿⢽⣱⣳
⠀⠀⢈⠠⠐⠀⠀⠀⣼⢣⠀⠀⠀⠀⠀⣿⠀⠀⠀⠇⠀⡯⡆⠀⠀⠀⡐⠂⠌⣿⡇⡚⡥⣿⠡⣿⠃⠀⠀⠀⢀⣀⡤⢶⣒⣂⣀⣀⡀⢛⣿⣿⣿⠛⠀⠀⠀⠀⠰⣿⣿⣱⣼⣾⣿⡿⢂⢱⡌⣳⣿⢣⢫⣟⣿⠁⢸⡟⢠⡟⠀⠀⠀⣿⡯⢵⣿⣿⣿⣿⣾⡟⡼⣿⣲⣙⢾⣇⢿⡐⢢⡿⡄⢿⣳⠀⠀⠹⣆⢸⣟⢭⣾⣿⣧⡿⣩⢞⣼⠟
⠀⠀⠀⢠⠁⠀⠀⢸⢇⡆⠀⠀⠀⠀⠀⢻⠀⠀⠀⢄⠀⡗⣿⠀⠈⠀⠔⡩⢈⣿⡧⡑⢣⣿⢡⡿⠀⠀⠀⣊⣽⣶⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠙⠳⠀⠀⠀⠀⠀⠛⠋⠉⠁⠙⠉⠛⠛⠛⠻⢿⣏⣖⡿⠹⠃⠀⠺⣿⠟⠁⠀⠀⠀⣿⡗⣸⠟⣿⣿⣿⣽⣯⢳⣿⡱⣏⢾⣿⢸⣯⡑⢷⡝⠈⣿⢧⠀⠀⢻⡎⢿⣿⣿⣿⡏⢶⣹⠞⠃⠤
⢀⡀⢀⡀⢀⠀⠀⠁⢈⠀⠀⠀⠀⠀⠀⠸⡆⠀⠀⢸⡄⣟⣿⠀⠠⠀⣂⠱⢨⣿⡗⣩⢸⣿⢸⡷⠶⣶⣾⣿⡿⠟⠉⣉⣤⣬⣥⣬⣍⠙⠻⢿⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⣀⣤⣤⠤⠀⠀⠀⠀⠿⣷⠿⢘⣿⣿⣿⣻⣷⣫⣿⡵⣫⢞⣿⡌⣿⡔⡈⣿⣄⠘⣯⣇⢀⢼⡷⠘⣿⡿⣓⣞⣿⣋⠤⣀⣴
⠀⠀⠀⢀⠀⠀⠀⢀⡀⠀⠀⠀⠀⢠⠀⠀⣿⠀⠀⠈⣷⣯⢾⡄⢘⠀⢡⠂⠱⣿⣏⠴⣸⣿⣿⣧⣾⣿⡿⠉⡤⣴⣿⢿⣻⣟⣿⡟⠉⠻⣄⠒⢙⢿⣏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢏⣁⣤⣤⣤⣤⡒⠀⠀⠀⠀⢸⢿⢿⣿⣿⣷⣻⡿⡼⢧⣛⣿⡆⢽⣷⡡⠇⣿⣷⡈⠻⣿⣿⢿⣀⢹⣗⣳⣾⣿⣿⣿⣿⣾
⡐⡼⠀⢠⡁⢎⠁⠠⠀⠀⠀⠀⢀⡟⠀⠰⢹⣇⠀⠀⢻⣿⣾⣇⠀⠂⠇⡘⠰⣿⣟⠲⠷⣿⣿⣿⣿⡟⠀⠘⣹⣿⢿⣯⢳⡻⢷⣷⣄⠀⢸⡇⠘⠐⠻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢶⣾⣿⣿⣿⣛⠿⠿⣿⣷⣄⠀⠀⠊⠀⠸⣿⣿⡷⣿⣿⡹⣏⢾⣽⣏⢼⣿⣇⢳⡹⣿⣿⣧⡈⠳⣼⡀⠘⣿⣿⡽⣾⣯⣿⣟⣿
⢠⠅⠀⠀⠐⡂⠀⡇⠀⠀⠀⠀⡼⠁⠀⠀⢿⣿⡆⠀⠸⣿⡷⣿⠀⠂⠇⡌⢳⣻⣿⡘⣘⣿⣿⡜⢿⣧⠀⠀⣿⣷⣴⣯⢷⣿⣗⣮⠽⣿⣿⡇⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣷⣾⣿⡶⣦⡉⠈⢻⣿⣷⡀⠀⠀⠰⣿⣿⣿⣿⢧⡟⣼⢫⣾⡿⡌⣿⣯⢎⣷⢻⣿⣻⡽⣷⣼⡇⠀⡛⠓⢫⡟⠷⠿⣞⣿
⠈⠀⠀⠁⠈⠀⠀⠄⠀⡀⠀⡼⠃⠀⠀⠀⠈⣿⣻⡄⠀⠘⣿⣻⡇⠐⣃⠜⣸⢹⣿⡇⢆⢿⣿⣇⠈⢻⣄⠀⣿⣷⣺⡷⠻⠿⠛⢿⣿⣹⣿⡗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⡀⠀⠀⠀⠀⠀⢀⡿⣿⣿⣿⣿⣻⡀⠀⢹⡆⠈⠻⣿⣿⡀⠀⢀⣿⣿⣿⣿⢫⣞⣭⢳⣿⣿⡱⣿⣿⣎⠼⣧⢿⡻⣷⣧⣻⠇⢱⣄⠐⠋⠀⠀⡴⠋⠀
⠄⠈⣄⡀⡖⠀⡴⠂⠀⣀⡾⠁⠀⠀⠀⠀⠀⢸⣏⢿⣆⠀⠹⣿⣧⠘⡤⡘⠤⢻⣿⡯⢜⢺⣿⣿⠀⠀⠉⠃⠘⢿⡇⠙⢧⣌⣠⡼⠻⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠄⠀⠀⠀⠀⠀⠀⣸⣿⣿⣼⣿⣯⣟⡷⣦⣤⣇⠀⠐⢻⣿⣿⠶⣾⣿⣿⣿⢯⠷⣞⠾⣭⣿⣿⡱⣿⣿⣯⡚⣽⡜⣷⠈⠙⣿⠈⣰⣿⡛⠒⠀⠀⠀⠀⠀
⠀⢸⣳⢿⠁⣾⡳⠀⣴⠋⠀⠀⠀⣼⠁⠀⠀⠈⣿⢎⡿⣦⠀⠹⣿⢇⡰⢡⠊⡝⢿⣿⣌⠺⣿⣿⣧⠀⠀⠀⠀⠈⠳⣤⣄⣈⣁⣤⣴⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠐⠀⠀⠀⠉⣿⣯⡿⣿⣿⣾⣽⡻⣿⣿⠀⠀⢸⣿⣿⣴⣿⣿⣿⣟⢯⡟⣮⢻⣼⣿⣿⣱⣿⣟⣿⡗⡬⣿⢸⣷⣰⢏⢰⣟⠀⢉⣵⠊⠂⢰⡆⠂
⠀⠸⣽⡏⢠⣷⡿⠋⠀⠀⠀⠀⡼⢹⠀⠀⠀⠀⠸⣧⣛⡽⣷⣄⠹⣧⠓⣌⢣⢘⠹⣿⣧⠣⢿⣾⠹⣦⠀⠀⠀⠀⠀⠈⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠠⠀⠀⠀⠀⠀⠀⠀⢿⡃⠷⣍⣥⣯⢷⣿⣿⠇⠀⠠⣼⣿⣿⣿⣿⣿⣿⣛⣮⢽⣚⣷⣿⣿⡟⣾⣯⣿⣻⣿⠴⣹⡄⣿⢿⣳⠏⠹⣴⠍⠀⠀⡴⠋⠀⢀
⠀⠰⠿⠾⠟⠁⠀⠀⠀⠀⣠⠞⠁⠈⠀⠀⠀⠀⠀⢹⣮⢳⡿⣿⣦⡘⢷⣈⠖⡌⡓⢿⣿⡧⣹⣿⡁⠘⢧⡀⠀⠀⠀⠄⠂⠠⠀⠄⠁⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠠⠀⠀⠘⢿⣇⣈⢡⡤⢠⣿⡏⠀⣠⠾⠛⠀⣸⣿⣿⣿⣳⡝⣮⣳⣝⣾⣿⣿⣹⣟⠾⣽⡿⣿⣇⢓⣿⣿⣷⣿⣦⠀⠁⠆⣠⠘⠀⢀⡰⠋
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠃⠀⠀⠀⢂⠀⠀⠀⠀⠀⢻⣧⡟⣿⣿⣷⣮⠻⣶⢌⡹⡘⣿⣷⡡⢿⡇⠀⠀⠛⣆⠀⠀⠀⠂⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⢀⡄⠀⠀⠂⠀⠀⠈⠙⠛⠶⠿⠋⠴⠚⠁⠀⠀⣰⣿⣿⣿⣛⡶⣫⢗⣳⣾⣿⣻⣧⣿⣝⣫⢿⣿⢿⣧⣿⣿⠛⣿⣷⣿⣳⡀⠀⢃⠀⠀⠞⠁⠀
⠀⠀⠀⠀⠀⠀⢀⡞⠉⢸⡆⠀⠀⠀⠈⡆⠀⠀⠀⠀⢸⣷⢻⣽⣷⣯⢿⣿⣾⣻⣴⢭⡹⣿⣷⠩⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠐⠈⡀⠂⠄⠠⠀⠄⡀⠀⠐⠀⠀⣽⣿⣿⢧⡻⣼⢣⣿⣾⣿⣳⣿⣿⣿⢞⣬⢻⣿⣿⣿⡋⠔⡆⣿⢿⡿⣷⣝⠄⠀⠴⠁⠀⣠⠞
⠰⢂⠀⠀⠐⠀⠈⡇⠀⠈⣇⠀⠀⠀⠀⣇⠀⠀⠀⠀⠈⢿⡆⠻⣿⣯⣟⣾⣿⣿⢿⣷⣧⣻⣿⣟⡼⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡁⠌⠀⠂⠄⠐⢈⠀⠀⢱⣿⣿⢽⢺⡵⣫⣿⣿⣻⣷⣿⢿⣳⣿⣯⢾⢿⣿⣟⣿⡆⢹⡇⣸⡜⢿⡽⣿⡆⠀⠀⢀⠐⢅⡘
⠐⢡⠢⠀⠀⡈⠀⡃⠀⠀⢽⡀⠀⠀⠀⣿⠀⠀⠀⢰⠀⢈⣿⡄⠙⢻⣿⣞⡳⣿⣿⣾⣹⠿⣿⣿⣶⣽⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣤⣦⣶⣶⣶⣶⣶⣦⣴⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠌⠀⠂⠁⠀⠈⠀⣼⡿⣝⢮⢷⣽⣿⡿⣿⣿⢿⡽⣯⡷⣿⣯⠝⡦⣿⣿⣽⡧⢈⡷⣽⡆⠘⣿⣿⣿⡀⠀⢋⠴⣸⣾
⠈⠄⠒⠀⢀⠀⠀⡁⠀⠀⠘⣇⠀⠀⠀⢸⡄⠀⠀⠘⡇⠀⢹⣿⡄⠘⢻⣿⣷⡩⢙⠿⣿⣿⣞⣿⣿⣿⣻⣷⠒⠒⠠⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⢿⣿⢿⣿⣿⣿⣻⣿⣻⣿⣿⣶⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣾⡿⣱⣯⣾⣿⡿⣽⣻⢿⣽⢯⣟⡷⣟⣿⡿⢬⡱⣿⣿⣞⣿⠀⣿⢸⣿⡀⠸⣿⣿⣷⠀⢈⡿⠉⠀
⠈⠄⠁⠀⠀⠀⠀⠀⠀⠀⠀⣿⡄⠀⠀⠀⣧⠀⠀⠀⢹⡄⠀⢻⣿⡄⠌⢿⣿⣷⡃⢎⡱⢻⣟⡻⣿⣿⣷⣾⣧⡀⠀⠀⠀⠀⠀⠀⣿⣿⠿⣭⢷⣯⣾⠾⡟⢾⡛⢯⡛⢿⠻⢿⣷⣿⣾⡿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⣤⣾⣿⣷⣿⣿⣟⣯⡷⣟⣯⣟⡿⣾⣻⣽⣻⣽⢾⣟⠦⣹⣿⣿⣞⣿⢀⣿⢾⣿⣿⡄⢿⣿⡿⠗⠋⠀⠀⠀
⠀⠌⠀⠀⠀⠀⠀⠀⠀⠀⠰⡸⣧⠀⠀⠀⢸⡆⠀⠀⠀⢷⡀⠈⣻⣿⡄⡘⢿⣿⣿⡜⢲⡩⢿⣖⢥⢻⣷⡻⣯⣿⣄⠀⠀⠀⠀⠀⢻⣿⣿⠟⣏⠳⣌⢳⡙⢦⡙⢦⡙⣎⠇⣧⢪⠝⣷⣿⣯⢿⣿⡏⠀⠀⠀⠀⠀⠀⠶⣟⣭⣵⢾⣿⣿⣳⣯⢿⣽⣻⣽⢾⣻⢷⣯⢷⣯⣟⡿⣿⡘⣼⣿⣿⣞⣿⢨⣯⣿⣿⣿⡇⢸⠋⠀⠀⠀⠀⠀⣼
⠀⠐⠀⠀⠀⠀⠀⠀⠄⠀⠀⠁⢿⣇⠀⠀⠀⢷⡄⠀⠀⠈⢧⠀⠸⣹⣿⣄⠙⣿⣿⣿⣥⠚⣬⢻⣮⢇⡻⣷⡍⢻⣯⢷⡀⠀⠀⠀⠀⢿⡱⣍⠮⣱⢪⠱⢎⢧⡙⡖⣩⠖⡭⣒⢥⡛⡴⢻⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⢷⣯⣟⡿⣞⣯⣟⣯⡿⣿⣞⡿⣾⣽⣻⡗⡥⣿⣿⡿⣽⣿⢾⣿⣿⣿⢿⣷⢸⠀⠀⠀⠀⢀⣼⡿
⠀⠀⠀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠈⣿⡄⠀⠀⠸⣿⡄⠀⠀⠘⣧⠀⢻⡻⣿⣆⠹⣿⣿⣿⣏⡆⢏⠽⣾⡱⠻⣷⡄⠈⠿⣿⣦⡀⠀⠀⠈⢿⣔⢣⢥⢣⡛⡜⢦⡹⢜⢢⢏⡲⡱⢪⡜⢥⣣⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣿⣿⣯⢿⡾⣽⣻⢯⣟⣾⢯⣿⣿⣯⣟⡷⣯⣿⢏⢴⣿⣿⣟⣳⣿⣻⣿⡿⠉⢸⣿⣸⠀⠀⠀⢠⣾⡿⣇
⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⢻⣿⡀⠀⠀⢳⣻⡄⠀⠀⠘⣧⡀⢳⡻⣿⣧⡸⢿⣿⣿⣿⣜⠲⡙⣿⣵⢛⣿⡄⠀⠀⠛⢿⣆⡀⠀⠀⠻⣧⢎⢣⠞⣩⢖⡱⣋⡜⢦⢓⣍⠳⣌⢧⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣪⣾⣿⣟⡾⣿⡽⣿⣽⣻⢯⣟⡿⣾⣿⣿⣽⣻⣽⡟⢮⣾⣿⣿⢷⣳⣿⣿⡛⢄⠂⣼⣧⡏⠀⠄⣰⣿⡿⣽⣻
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⡀⠀⠀⠈⢷⣿⡀⠀⠀⠋⢳⡀⠀⠀⠘⣷⡀⠳⡙⣿⣷⡎⢿⣿⣿⣿⣿⣑⢎⠿⣿⣚⣿⣄⠀⠀⠀⠈⠛⢦⣀⠀⠈⠻⢦⣏⡵⢪⡕⣣⠞⣱⢪⢜⣳⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣨⣾⣿⣿⣻⣾⣟⡷⣟⣿⡽⣯⡿⣯⣿⣿⣿⢷⣯⢷⣿⡩⣶⣿⣿⣿⢫⣿⡿⢣⡍⢖⣸⣾⣿⡇⣠⣾⣿⣻⣽⢿⣽
⠀⠀⠀⠐⠀⠀⠀⠀⠀⢸⣧⠀⢠⠀⠀⠳⣿⡄⠀⠀⠈⢷⡄⠀⠀⠘⢧⠀⠀⠘⢻⣿⣧⢿⣿⣿⣿⣿⣯⣞⡹⢿⣮⣿⣆⠀⠀⠀⠀⠀⠈⠓⠦⠄⠀⠉⠛⠷⢾⣥⣿⡶⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣠⣾⣿⣿⣻⣞⣿⠹⣿⣟⣿⣳⢿⣯⣿⣿⣿⣿⣯⢿⡾⣿⠣⣵⣿⣿⣿⣏⣿⡿⣡⠗⡸⣦⣿⣿⢿⣳⣿⣟⡷⣯⣟⡿⣾
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠈⢧⠀⡇⠀⠀⠹⡽⣆⠀⠀⠀⢻⣄⠀⠀⠈⢳⡀⠀⠀⠛⣿⣟⡾⣽⣿⣿⣿⢿⣷⣍⡿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢄⣵⣿⣿⡿⣽⣞⡷⣿⡏⠛⠸⣿⣿⣽⣿⣿⣿⣿⣿⡿⣽⢯⣿⢉⣿⣿⣿⣿⡿⣾⢯⡜⢧⢫⣵⣿⡿⣽⣻⢯⣷⣻⣽⢿⣽⣻⣽
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡧⠀⡈⢧⣹⡀⠀⠀⠉⠈⠳⣄⠀⠀⠛⣦⡀⠀⠀⠙⣆⠀⠀⠌⠻⣟⣷⣻⢿⣿⡮⡝⢿⣷⣝⣻⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣐⣦⣾⣿⡿⣯⡷⣟⣿⣞⣿⣟⣀⣤⣶⢿⢫⠳⣽⣿⣿⣿⡿⣽⣯⡟⢧⣾⣿⣟⣾⣿⣽⣯⣳⢭⣛⣾⣿⢯⣟⡿⣽⡿⣽⣻⢾⣯⡷⣿⣽
⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⢠⡇⠀⢻⣷⡀⠀⠸⢦⠀⠈⠳⣄⠀⠹⣷⣄⠀⠀⠈⠳⣄⠀⠀⠉⠳⣯⣟⣿⣿⣞⢢⣍⠿⢷⣯⣿⣿⣿⣟⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⢀⣤⣾⣿⣿⣿⢿⣟⡷⣿⣿⣼⡿⣟⠿⣫⢳⢭⡞⣭⠻⣔⣻⣿⣿⣽⡷⢯⣽⣿⣿⣟⣾⣿⣿⣟⡶⣏⣷⣿⣟⣯⡿⣯⣟⣯⣿⡽⣯⣿⣞⣿⣳⣿
⠀⠀⠠⠀⠀⠀⠀⠀⢸⡅⢸⣇⠀⣀⢉⣷⡄⠀⠈⢷⣀⣀⣈⣳⣄⣈⢾⡳⣄⡀⠀⠈⠳⣄⠀⠀⠈⠻⣾⡿⣿⣎⡴⣋⣎⡗⢯⢷⣿⣿⣾⡼⢏⡿⣶⣤⣄⣀⠀⠀⠀⠀⠀⣀⣤⣶⣿⣿⣿⣿⣿⣿⣯⣿⣿⡟⣯⡹⠼⣥⢻⡱⣏⠾⣜⢧⣛⣴⣿⣿⡷⢯⣽⣿⣿⣿⣻⣞⣯⣿⣿⣯⢿⣽⣿⣻⢾⣯⣟⣷⢿⣽⣞⣿⣽⡾⣽⣾⣻⢾
⠀⠀⠂⠀⠀⠀⠀⠀⢸⠀⠸⠋⠉⠉⠉⠉⠙⢦⡀⠈⢻⣍⣀⣀⣀⣀⡈⠙⠮⣷⣦⡀⠀⠈⠳⣄⠀⠀⢈⠹⢿⣿⣶⡱⢮⡜⣏⡞⡼⣹⢟⣿⣿⣳⣏⣞⢞⡻⣟⡶⣶⢶⡾⣟⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣭⣓⣎⢳⣣⣝⢮⣓⢮⣾⣿⡿⣫⣽⣿⣿⣿⣻⣞⣷⢿⣽⣻⣿⣟⣿⢿⣳⣿⣻⡾⣽⡾⣟⣷⣻⣾⣳⢿⣻⣾⡽⣿
⠀⠀⡁⠀⠀⠀⠀⠀⣸⠀⣸⡶⠛⠛⠛⠓⠛⠺⠿⠦⣄⠈⠻⢭⡉⠙⠛⢷⣄⠀⠉⠙⢶⣤⣀⠈⠳⢤⣀⠀⠢⠙⠿⣿⣞⡼⡱⢞⡵⣋⠾⡼⣍⡟⡿⣾⢭⡻⣼⡹⣎⡷⣹⢎⡷⣿⡟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣭⣶⣽⣾⢿⣹⢾⣿⠛⠙⣿⣷⢯⣿⢾⣯⣟⣿⣿⣽⡾⣟⡿⣞⣷⢿⣯⣟⣯⣟⣷⢯⣟⣿⣳⣯⣿⣽
⠀⠐⠀⠀⠀⠀⠀⢠⡇⠀⡇⠁⠀⠀⠀⠀⠀⡀⠀⠀⠈⠙⠶⠦⣄⠀⠠⠀⠨⡟⢦⡀⠀⠹⣍⠛⠲⣤⣉⡳⣦⣌⡉⡔⡛⠿⣷⣫⡼⣍⢷⡹⣎⡽⡳⣝⢮⡳⢧⡻⣜⡳⣝⣮⢳⣹⣏⠜⣻⣿⢽⣿⣿⡿⠿⠿⠟⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣟⡋⠀⠐⠀⠈⢿⣿⣯⢿⡾⣽⣾⣿⣯⣟⡿⣽⡿⣽⣻⣾⣽⣻⢾⣯⢿⣻⣾⣽⣳⡿⣾
⠀⠜⠀⠀⠀⠀⠀⠀⡇⢠⡇⠀⠀⠀⠄⢂⠡⢀⠉⡠⠡⠄⡠⠠⠀⡌⠄⠣⡐⢈⠌⢻⣆⠀⠈⠳⣄⣀⣹⠟⣷⣾⣿⣿⣯⣞⣥⣻⢛⣾⣮⣷⣙⢾⡱⣏⢾⣙⢧⡻⣜⡳⣝⢶⣫⡿⠋⠁⣱⡽⠚⠉⠀⣀⣠⣤⣤⣤⣤⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⣤⣾⣿⢯⣟⣿⣽⢾⣻⣯⡿⣽⣯⢿⣽⢷⣻⣞⣯⣿⢾⣟⡿⣞⣷⢿⣽⣻
⠈⡆⠀⠀⠀⠀⠀⠀⠁⢸⠇⠀⠀⡈⠐⢀⠆⠢⠑⡄⢃⠆⡑⢈⠒⠄⢢⠑⡐⠢⢈⠡⢎⠷⣄⠀⣩⣿⣷⣾⣿⡎⢳⣿⣿⣹⢛⠿⢿⣶⡿⣿⢿⡿⣷⣿⡾⣝⢮⡳⣭⢳⢽⡾⠋⢀⣠⠞⠁⢀⣴⣶⣿⡿⣟⣯⢿⣽⣻⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣣⣾⣿⢿⣽⣻⣟⣾⣽⣻⢯⣿⡽⣟⣾⢿⣽⣻⢯⣟⣷⣯⢿⣾⣻⢯⣟⣯⡿⣽
⠠⠅⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠌⢌⠠⢊⠔⠡⠌⢢⠘⡄⠣⠘⠌⣂⠱⠈⢅⠊⠤⡈⢹⣸⠟⠉⣹⣿⣷⣿⣿⡄⢲⣍⠛⡛⠿⢷⡶⢷⠿⠶⠿⠶⠷⠿⠾⢾⠷⣾⣧⣿⣵⣿⠟⠁⣠⣾⣿⣿⣽⢾⣽⢯⣟⡿⣞⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣽⣻⣾⣻⢾⣽⣾⣻⢯⣷⢿⣻⡽⣟⣾⣟⣯⡿⣾⡽⣟⣾⣻⣯⢿⡽⣟⣿
⢠⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡘⠄⡊⢆⡘⠤⣉⠆⡱⢨⢡⠋⡔⡠⢡⠉⢆⡘⠐⣠⡾⠋⠀⣰⣿⣿⡿⠟⢻⣿⣮⣽⣧⢌⠒⠉⠀⣀⣀⣀⣀⣠⣤⣴⣿⣿⣿⣿⣿⣯⣍⡉⢶⣾⣿⣿⣿⣿⣿⣿⣿⡿⣽⣻⡽⣞⣷⣻⢿⣿⣿⡛⢛⠛⠻⠿⠿⠿⠿⣯⣷⣿⣽⣯⣷⢯⣟⡿⣽⣻⢯⣟⣿⣳⣯⢿⣽⡷⣿⣻⡽⣷⣻⣯⢿⡿⣽
⠂⠀⠀⠀⠀⠀⠀⠁⠀⠈⠉⠉⠀⠐⢌⠰⢂⠜⡐⠦⣉⠖⡡⢎⠲⢄⠱⢂⢍⣰⣤⠿⡿⠁⠀⢤⣿⣿⣿⡷⡀⠄⢿⣿⣿⡿⠗⠚⠛⠉⠁⠀⠠⠀⢀⢀⡀⣀⡉⢿⡌⢿⣿⣻⣧⠈⣿⣿⣿⣽⣷⣿⢿⣽⣻⢷⣯⢿⣽⣳⣯⢿⣿⣿⣿⣶⣉⣔⣂⠆⠤⢀⠀⡀⠈⠉⠙⠛⠻⠿⣽⣿⣽⣟⡿⣾⡽⣯⣿⢾⣽⡷⣟⣿⡽⣷⣻⣯⣿⢿
⣀⣀⣠⣤⣤⡤⠴⠶⠶⡖⢶⢲⡖⡊⢄⢣⢊⡜⣡⢓⡌⡚⡕⢎⠳⡌⢣⡼⠞⠋⢀⡾⠁⢀⢀⣾⣿⢻⣿⡇⢙⣺⠖⠋⠀⢀⣠⣤⣴⣶⣾⡿⣿⣿⡿⣿⣿⣿⣿⣿⣷⡄⢻⣯⣿⣇⣸⠛⠛⠛⠛⠞⠿⠞⠿⠿⠾⠿⠾⢷⣯⣿⣻⣿⡝⢿⣅⡀⠀⠈⠈⠁⠉⠒⠳⠧⣤⣀⣀⠀⠀⠈⠉⠛⢿⣷⣿⣻⢾⣯⡷⣿⣻⣞⣿⡽⣷⢯⣿⣻
⡻⣜⢲⡑⢢⠡⡉⢌⡑⢌⢂⠣⡔⡡⢎⡰⠢⡜⢤⢋⡔⠻⠸⢬⠷⠚⠉⠀⣀⢈⡟⠀⠀⢀⣼⣿⡞⣿⣿⣇⣾⢁⣀⣴⣾⣿⣟⣯⢿⡽⣾⣽⣳⣯⣿⣽⣻⣿⣿⢿⡿⣿⣤⣿⣿⣿⣹⣧⣤⣤⣤⣤⣄⣀⣀⣀⡀⡀⠀⠀⠀⠀⠙⣿⣦⡀⠌⢙⢿⣷⣶⣶⣶⣦⣤⣀⣀⢈⣉⡛⢳⢶⣀⠀⡈⣿⣷⣟⡿⣾⣽⢷⡿⣽⣾⣻⣽⢿⡿⣽
`

const kotekczek = `
 ╱|、
(˚ˎ 。7
 |、˜〵
じしˍ,)ノ
`

printf(ffstring);
})();
