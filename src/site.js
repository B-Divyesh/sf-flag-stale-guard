import './style.css';
import './a11y.css';

const sampleFlags = [
  { key: 'checkout-v2', owner: 'Mina', expiry: '2026-12-01', status: 'Tracked', refs: ['src/checkout.ts:2'] },
  { key: 'legacy-cart', owner: 'Drew', expiry: '2026-02-15', status: 'Expired', refs: ['src/checkout.ts:6', 'src/legacy.ts:1'] },
  { key: 'billing-surge-cap', owner: 'Inez', expiry: '2026-10-01', status: 'Tracked', refs: [] }
];
const app = document.querySelector('#app');
const routes = { '/': home, '/demo': demo, '/privacy': privacy, '/terms': terms, '/404.html': missing };
let reviewedReference = false;
const metadata = {
  '/': {
    title: 'Flag Stale Guard — find flags ready for removal',
    description: 'Find expired release flags and block removal while source references remain.'
  },
  '/demo': {
    title: 'Demo — Flag Stale Guard',
    description: 'Inspect three sample release flags and a removal block without changing a repository.'
  },
  '/privacy': {
    title: 'Privacy — Flag Stale Guard',
    description: 'Read how the local CLI and sample website handle source code and browser data.'
  },
  '/terms': {
    title: 'Terms — Flag Stale Guard',
    description: 'Read the terms and limits for using Flag Stale Guard.'
  },
  '/404.html': {
    title: 'Not found — Flag Stale Guard',
    description: 'The requested Flag Stale Guard page could not be found.'
  }
};

function nav() { return `<header><a class="mark" href="/" data-route><span aria-hidden="true">✣</span> Flag Stale Guard</a><nav aria-label="Main navigation"><a href="/?demo=1" data-route>Demo</a><a href="/#how">How it works</a><a href="/privacy" data-route>Privacy</a></nav></header>`; }
function foot() { return `<footer><p>Local checks for configured release flags.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · v0.1.0</p></footer>`; }
function heroArt() { return `<figure class="hero-art"><img src="/field-guide-hero.webp" width="1200" height="800" fetchpriority="high" alt="Pressed green and dried red leaves on a field-guide page, representing active and expired flags." /></figure>`; }
const terminalTranscript = `$ flag-stale-guard demo
Demo workspace: [temporary workspace]
Sample data only; nothing in your repository changed.
Flag inventory

checkout-v2 — tracked
  owner: Mina | expiry: 2026-12-01 | adapter: literal
  source references: 1
    src/checkout.ts:2

legacy-cart — expired
  owner: Drew | expiry: 2026-02-15 | adapter: literal
  source references: 2
    src/checkout.ts:6
    src/legacy.ts:1
  removal checklist:
    - Confirm the flag's rollout is complete.
    - Remove every source reference listed below.
    - Delete the flag from its provider after code cleanup.
    - Run the test suite before release.

billing-surge-cap — tracked
  owner: Inez | expiry: 2026-10-01 | adapter: literal
  source references: 0`;

function terminalRecording() { return `<section class="terminal-wrap terminal-recording" aria-labelledby="recording-title"><div class="section-label"><div><p class="eyebrow">Terminal recording</p><h2 id="recording-title">See the actual CLI demo</h2></div><a class="recording-download" href="/cli-demo-recording.svg" download>Download terminal recording</a></div><p class="recording-note">Recorded from the shipped <code>flag-stale-guard demo</code> command. Each run uses its own temporary workspace.</p><figure class="recording-frame"><img id="cli-demo-recording" src="/cli-demo-recording.svg" width="920" height="780" loading="lazy" alt="Recorded terminal run of flag-stale-guard demo. It creates a temporary workspace, lists three flags, and shows two source references for expired legacy-cart." /></figure><details class="terminal-transcript"><summary id="cli-demo-transcript-control">Read the full terminal transcript</summary><pre id="cli-demo-transcript"><code>${terminalTranscript}</code></pre></details></section>`; }

function home() { return `${nav()}<main id="main" tabindex="-1"><section class="hero"><div><p class="eyebrow">A command-line tool for release flag cleanup</p><h1>Find flags ready for removal</h1><p class="lede">For maintainers who need to remove old flags without leaving source references behind.</p><p class="actions"><a class="button" href="/?demo=1" data-route>Try it with sample data</a><span>See an expired flag and its source references.</span></p><ul class="facts"><li>Runs from a repository checkout.</li><li>Sends no source code away.</li><li>MIT licensed.</li></ul></div>${heroArt()}</section>${terminalRecording()}<section id="how" class="steps" aria-labelledby="how-title"><div><p class="eyebrow">How it works</p><h2 id="how-title">Find expired flags and remaining references</h2></div><ol><li><b>List each flag.</b><span>Add an owner and a <code>YYYY-MM-DD</code> expiry date to one config file.</span></li><li><b>Scan configured paths.</b><span>See source references for every known flag.</span></li><li><b>Check before removal.</b><span>Get a checklist after expiry. Block removal while source references remain.</span></li></ol></section><section class="limits" aria-labelledby="limits-title"><p class="eyebrow">Clear limits</p><h2 id="limits-title">What Flag Stale Guard does not decide</h2><p>It finds configured source references. It cannot tell which users see a flag or prove what your code does when it runs.</p><p>Review the checklist and your tests before deleting a flag.</p></section><section id="install" class="install" aria-labelledby="install-title"><p class="eyebrow">Install from the repository</p><h2 id="install-title" tabindex="-1">Run it in a repository</h2><pre><code>git clone https://github.com/B-Divyesh/sf-flag-stale-guard.git
cargo install --path sf-flag-stale-guard
flag-stale-guard scan --config flag-stale-guard.toml --check</code></pre><a href="https://github.com/B-Divyesh/sf-flag-stale-guard" rel="external">Read the repository on GitHub (opens another site)</a></section></main>${foot()}`; }
function demo() { const reviewLabel = reviewedReference ? 'Source reference reviewed' : 'Mark first source reference reviewed'; return `${nav()}<main id="main" tabindex="-1"><div class="demo-banner"><span><b>Demo</b> — sample data, nothing is saved.</span><span><button id="reset">Reset demo</button><a href="/#install" data-route>View install steps</a></span></div><p id="demo-notice" class="demo-notice" role="status" aria-live="polite"></p><section class="demo-head"><p class="eyebrow">Sample repository scan</p><h1>Inspect three configured flags</h1><p class="lede">One flag expired. Its removal stays blocked until both source references disappear.</p></section><section class="inventory" aria-labelledby="inventory-title"><h2 id="inventory-title">Flag inventory</h2><div id="flag-list">${sampleFlags.map(flagCard).join('')}</div></section><section class="check-panel" aria-labelledby="check-title"><p class="eyebrow">Removal check</p><h2 id="check-title">legacy-cart is blocked</h2><p>Two source references remain in the configured sample paths.</p><ul><li><code>src/checkout.ts:6</code> ${reviewedReference ? '<span class="reviewed">Reviewed in this demo</span>' : ''}</li><li><code>src/legacy.ts:1</code></li></ul><button id="review-reference" aria-pressed="${reviewedReference}">${reviewLabel}</button><p class="notice">This only marks the sample for review. It does not change the removal result.</p><p class="notice">Next: remove both source references, then run <code>flag-stale-guard remove-check legacy-cart</code>.</p></section><section class="demo-command" aria-labelledby="command-title"><h2 id="command-title">Run the same sample locally</h2><pre><code>cargo run -- demo
cargo run -- remove-check legacy-cart --config examples/flag-stale-guard.toml</code></pre></section></main>${foot()}`; }
function flagCard(f) { const status = f.status === 'Expired' ? 'danger' : 'good'; return `<article class="flag ${status}"><div><h3>${f.key}</h3><p>Owner: ${f.owner} · Expires: ${f.expiry}</p></div><div><span class="status">${f.status}</span><p>${f.refs.length} source reference${f.refs.length === 1 ? '' : 's'}</p></div></article>`; }
function legal(title, content) { return `${nav()}<main id="main" tabindex="-1" class="prose"><p class="eyebrow">Flag Stale Guard</p><h1>${title}</h1>${content}</main>${foot()}`; }
function privacy() { return legal('Privacy for local flag checks', '<p>Flag Stale Guard does not collect analytics or send source code to a service.</p><p>The CLI searches only the paths you configure. The website demo uses fixed sample data in your browser and does not store it.</p><p>There are no accounts, payments, or cookies.</p>'); }
function terms() { return legal('Terms for Flag Stale Guard', '<p>Flag Stale Guard is provided under the MIT License.</p><p>Source search is a removal aid. It cannot prove runtime behavior or replace review and tests.</p><p>Use it with your repository practices and release checks.</p>'); }
function missing() { return legal('Page not found', '<p>The page may have moved, or the address may be wrong.</p><p><a href="/" data-route>Return to Flag Stale Guard home.</a></p>'); }
function setMetadata(path) {
  const values = metadata[path];
  const canonicalPath = path === '/404.html' ? location.pathname : path;
  const canonical = new URL(canonicalPath, 'https://flag-stale-guard.sociobot.in').href;
  document.title = values.title;
  document.querySelector('meta[name="description"]').content = values.description;
  document.querySelector('link[rel="canonical"]').href = canonical;
  document.querySelector('meta[property="og:title"]').content = values.title;
  document.querySelector('meta[property="og:description"]').content = values.description;
  document.querySelector('meta[property="og:url"]').content = canonical;
  document.querySelector('meta[name="twitter:title"]').content = values.title;
  document.querySelector('meta[name="twitter:description"]').content = values.description;
}

function activePath() {
  if (location.search.includes('demo=1')) return '/demo';
  return routes[location.pathname] ? location.pathname : '/404.html';
}
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusKey(element = document.activeElement) {
  if (!element || element === document.body || element === document.documentElement) return 'heading';
  if (element.id) return `#${element.id}`;
  const index = [...document.querySelectorAll(focusableSelector)].indexOf(element);
  return index >= 0 ? `focusable:${index}` : 'heading';
}

function findFocusTarget(key) {
  if (key?.startsWith('#')) return document.querySelector(key);
  if (key?.startsWith('focusable:')) return document.querySelectorAll(focusableSelector)[Number(key.slice(10))];
  return document.querySelector('h1');
}

function saveCurrentEntry() {
  history.replaceState({
    ...(history.state ?? {}),
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    focus: focusKey()
  }, '');
}

function restoreEntry(state) {
  const saved = state ?? {};
  requestAnimationFrame(() => {
    window.scrollTo(saved.scrollX ?? 0, saved.scrollY ?? 0);
    const target = findFocusTarget(saved.focus);
    target?.focus({ preventScroll: true });
  });
}

function render(focusHeading = false, demoMessage = '') { const path = activePath(); app.innerHTML = `${routes[path]()}<p id="route-status" class="sr-only" aria-live="polite"></p>`; setMetadata(path); document.querySelectorAll('pre').forEach(region => { region.tabIndex = 0; }); const heading = document.querySelector('h1'); if (heading) { heading.tabIndex = -1; if (focusHeading) heading.focus({ preventScroll: true }); document.querySelector('#route-status').textContent = heading.textContent; } const notice = document.querySelector('#demo-notice'); if (notice && demoMessage) notice.textContent = demoMessage; document.querySelector('#reset')?.addEventListener('click', () => { reviewedReference = false; render(false, 'Demo reset to the original three flags.'); document.querySelector('#reset').focus(); }); document.querySelector('#review-reference')?.addEventListener('click', () => { reviewedReference = !reviewedReference; render(false, reviewedReference ? 'First source reference marked reviewed in this demo.' : 'First source reference is no longer marked reviewed.'); document.querySelector('#review-reference').focus(); }); document.querySelectorAll('[data-route]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); const href = link.getAttribute('href'); saveCurrentEntry(); history.pushState({ scrollX: 0, scrollY: 0, focus: 'heading' }, '', href); render(true); const install = document.querySelector('#install-title'); if (location.hash === '#install' && install) { install.scrollIntoView(); install.focus({ preventScroll: true }); requestAnimationFrame(saveCurrentEntry); } else { window.scrollTo(0, 0); } })); }

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.querySelector('.skip')?.addEventListener('click', event => {
  event.preventDefault();
  const main = document.querySelector('#main');
  main?.scrollIntoView();
  main?.focus({ preventScroll: true });
});
window.addEventListener('pagehide', saveCurrentEntry);
window.addEventListener('scroll', saveCurrentEntry, { passive: true });
document.addEventListener('focusin', saveCurrentEntry);
window.addEventListener('popstate', event => { render(false); restoreEntry(event.state); });
render();
