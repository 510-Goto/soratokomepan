// top.js（置き換え）
document.addEventListener('DOMContentLoaded', () => {
  const isHome = document.body.classList.contains('is-home');
  const drawer = document.getElementById('drawer_input');
  const nav = document.querySelector('.nav');

  // ① ヘッダー表示：トップだけスクロール量で切替
  if (isHome) {
    const showAt = 1; // 1pxでもスクロールしたら表示
    const updateHeader = () => {
      document.body.classList.toggle('after-hero', window.scrollY >= showAt);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  } else {
    document.body.classList.add('after-hero'); // 他ページは常時表示
  }

  // ② ナビ内リンク：同一ページ内(#...)は閉じてからスムーススクロール
  const smoothGoToHash = (hash) => {
    if (!hash) return;
    // ハッシュ更新（戻るボタン対応）
    history.pushState(null, '', hash);
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const closeThen = (cb) => {
    if (!(drawer && drawer.checked)) { cb(); return; }
    const onEnd = (ev) => {
      if (ev.target !== nav || ev.propertyName !== 'transform') return;
      nav.removeEventListener('transitionend', onEnd);
      cb();
    };
    nav.addEventListener('transitionend', onEnd, { once: true });
    // 念のためフォールバック（CSSは .80s なので少し長め）
    const fallback = setTimeout(() => { nav.removeEventListener('transitionend', onEnd); cb(); }, 900);
    const cbWrap = () => { clearTimeout(fallback); cb(); };
    nav.addEventListener('transitionend', cbWrap, { once: true });
    drawer.checked = false; // 閉じる開始
  };

  document.querySelectorAll('.nav a, .menu_list_btn').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      // 「#...」のみ＝同一ページ内スクロール
      if (href.startsWith('#')) {
        e.preventDefault();
        closeThen(() => smoothGoToHash(href));
        return;
      }
      // それ以外（別ページ遷移）はそのまま遷移（= がたつき回避）
    });
  });
});
