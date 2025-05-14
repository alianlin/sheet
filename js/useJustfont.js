export function initJustfont() {
  setTimeout(() => {
    if (typeof _jf !== 'undefined' && typeof _jf.flush === 'function') {
      console.log('🔁 呼叫 _jf.flush() 套用 justfont 字體');
      _jf.flush();
    } else if (window.justfont?.load instanceof Function) {
      console.log('🔁 備用呼叫 justfont.load()');
      window.justfont.load();
    } else {
      console.warn('⚠️ justfont 無法套用，_jf / justfont 未正確載入');
    }
  }, 300);

  if (typeof _jf !== 'undefined' && Array.isArray(_jf)) {
    _jf.push(['_eventActived', () => console.log('✅ justfont 字體已成功套用')]);
    _jf.push(['_eventInactived', () => console.warn('❌ justfont 字體套用失敗')]);
  }
}