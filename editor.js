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
  const target = $('targetBanner').value || 'hero-banner-v12.html';
  const url = new URL(target, window.location.href);
  const params = currentParams();

  const rev = localStorage.getItem(`tartuf-publish-rev-${target}`);
  if (rev) params.set('rev', rev);

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

$('saveBtn').addEventListener('click', () => {
  const preset = {
    title: $('title').value,
    subtitle: $('subtitle').value,
    ctaText: $('ctaText').value,
    ctaHref: $('ctaHref').value,
    bgUrl: $('bgUrl').value
  };
  localStorage.setItem(presetKey(), JSON.stringify(preset));

  const target = $('targetBanner').value;
  const revKey = `tartuf-publish-rev-${target}`;
  const rev = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  localStorage.setItem(revKey, rev);

  alert('Preset uložen a vygenerována nová publish URL pro vybraný banner.');
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
