'use strict';
(function () {
  function parseTarget(fragment) {
    if (fragment.length > 8192) throw new Error('Ссылка слишком длинная.');
    const params = new URLSearchParams(fragment.replace(/^#/, ''));
    const keys = [...params.keys()];
    if (keys.length !== 2 || keys.filter(k => k === 'vault').length !== 1 || keys.filter(k => k === 'file').length !== 1) {
      throw new Error('В ссылке должны быть только vault и file.');
    }
    const vault = params.get('vault'), file = params.get('file');
    if (!vault || !file || /[\x00-\x1f\x7f]/.test(vault+file) ||
        /[/\\]/.test(vault) || /[\\:#]/.test(file) || file.startsWith('/') ||
        file.split('/').some(p => !p || p.startsWith('.')) || !file.endsWith('.md')) {
      throw new Error('Некорректное имя волта или путь заметки.');
    }
    return {vault, file, uri: 'obsidian://open?vault='+encodeURIComponent(vault)+'&file='+encodeURIComponent(file)};
  }
  if (typeof module !== 'undefined') module.exports = {parseTarget};
  if (typeof document === 'undefined') return;
  try {
    const target = parseTarget(location.hash);
    document.getElementById('note').textContent = target.vault+' / '+target.file;
    document.getElementById('status').textContent = 'Нажмите кнопку, чтобы открыть исходную заметку.';
    const link = document.getElementById('open');
    link.href = target.uri;
    link.hidden = false;
  } catch (error) {
    document.getElementById('status').textContent = error.message;
  }
})();
