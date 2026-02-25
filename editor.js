const $ = (id) => document.getElementById(id);
const preview = $('preview');
let localBgData = '';

function currentParams() {
  const title = $('title').value.trim();
  const subtitle = $('subtitle').value.trim();
  const ctaText = $('ctaText').value.trim();
  const ctaHref = $('ctaHref').value.trim();
  const bgUrl = $('bgUrl').value.trim();

  const p = new URLSearchParams();
  if (title) p.set('title', title);
  if (subtitle) p.set('subtitle', subtitle);
  if (ctaText) p.set('ctaText', ctaText);
  if (ctaHref) p.set('ctaHref', ctaHref);
  if (bgUrl) p.set('bg', bgUrl);
  if (!bgUrl && localBgData) p.set('bg', localBgData);
  return p;
}

function buildBannerUrl() {
  const target = $('targetBanner').value || 'hlavni-banner.html';
  const url = new URL(target, window.location.href);
  const params = currentParams();

  const publishedRaw = localStorage.getItem(`tartuf-publish-data-${target}`);
  if (publishedRaw) {
    try {
      const published = JSON.parse(publishedRaw);
      if (published.rev) params.set('rev', published.rev);
    } catch {}
  }

  url.search = params.toString();
  return url.toString();
}

function updateEmbedCode(url) {
  const full = `<iframe src="${url}" width="100%" style="aspect-ratio:1704/1032;" frameborder="0" scrolling="no"></iframe>`;
  $('embedCode').textContent = full;
}

function apply() {
  const url = buildBannerUrl();
  preview.src = url;
  updateEmbedCode(url);
}

function updateTargetHint() {
  const select = $('targetBanner');
  const text = select.options[select.selectedIndex]?.text || 'Banner';
  $('targetHint').textContent = `Aktuálně upravuješ: ${text}`;
}

function setActiveTab(target) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });
}

$('applyBtn').addEventListener('click', apply);
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $('targetBanner').value = btn.dataset.target;
    setActiveTab(btn.dataset.target);
    updateTargetHint();
    loadPreset();
    apply();
  });
});

function presetKey() {
  return `tartuf-banner-preset-${$('targetBanner').value}`;
}

const N8N_WEBHOOK_URL = 'https://n8n.srv1004354.hstgr.cloud/webhook-test/tartuf-publish';

function mapTargetForWorkflow(target) {
  if (target === 'hlavni-banner.html') return 'hlavni';
  if (target === 'doplnkovy-banner-1.html') return 'doplnkovy1';
  if (target === 'doplnkovy-banner-2.html') return 'doplnkovy2';
  return 'hlavni';
}

$('saveBtn').addEventListener('click', async () => {
  const preset = {
    title: $('title').value,
    subtitle: $('subtitle').value,
    ctaText: $('ctaText').value,
    ctaHref: $('ctaHref').value,
    bgUrl: $('bgUrl').value
  };
  localStorage.setItem(presetKey(), JSON.stringify(preset));

  const target = $('targetBanner').value;
  const uniquePart = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  const rev = `pub-${Date.now()}-${uniquePart}`;
  const publishData = { ...preset, rev, publishedAt: new Date().toISOString() };
  localStorage.setItem(`tartuf-publish-data-${target}`, JSON.stringify(publishData));

  const payload = {
    target: mapTargetForWorkflow(target),
    title: preset.title,
    subtitle: preset.subtitle,
    ctaText: preset.ctaText,
    ctaHref: preset.ctaHref,
    bgUrl: preset.bgUrl
  };

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert(`Lokálně uloženo, ale odeslání do n8n selhalo (HTTP ${res.status}).`);
    } else {
      alert('Změny uloženy, publikovány a odeslány do n8n workflow.');
    }
  } catch (e) {
    alert('Lokálně uloženo, ale n8n endpoint není dostupný.');
  }

  apply();
});

$('copyBtn').addEventListener('click', async () => {
  const url = buildBannerUrl();
  await navigator.clipboard.writeText(url);
  alert('URL banneru zkopírována.');
});

$('copyEmbedBtn').addEventListener('click', async () => {
  await navigator.clipboard.writeText($('embedCode').textContent || '');
  alert('Iframe kód zkopírován.');
});

$('bgFile').addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    localBgData = String(r.result || '');
    apply();
  };
  r.readAsDataURL(file);
});

function loadPreset() {
  const saved = localStorage.getItem(presetKey());
  if (!saved) return;
  try {
    const p = JSON.parse(saved);
    if (p.title) $('title').value = p.title;
    if (p.subtitle) $('subtitle').value = p.subtitle;
    if (p.ctaText) $('ctaText').value = p.ctaText;
    if (p.ctaHref) $('ctaHref').value = p.ctaHref;
    if (p.bgUrl) $('bgUrl').value = p.bgUrl;
  } catch {}
}

(function bootstrap() {
  setActiveTab($('targetBanner').value);
  updateTargetHint();
  loadPreset();
  apply();
})();
