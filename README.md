# Tartuf Shoptet Bannery

Tento projekt obsahuje animované HTML5 bannery pro váš Shoptet, hostované zdarma na GitHub Pages.

## Jak zprovoznit GitHub Pages

1. **Vytvořte repozitář na GitHubu**:
   - Přejděte na [github.com](https://github.com) a vytvořte nový projekt (např. `tartuf-bannery`).
   - Nastavte jej jako **Public**.

2. **Nahrajte tyto soubory**:
   - Nahrajte všechny soubory z této složky do svého nového repozitáře.

3. **Aktivujte Pages**:
   - V nastavení repozitáře (**Settings**) najděte v levém menu **Pages**.
   - V sekci **Build and deployment** vyberte u **Branch** větev `main` (nebo `master`) a složku `/(root)`.
   - Klikněte na **Save**.
   - Po chvíli se nahoře objeví odkaz (např. `https://uzivatel.github.io/tartuf-bannery/`).

## Jak vložit banner do Shoptetu

V administraci Shoptetu (např. v modulu Bannery nebo v popisu produktu) vložte následující kód do HTML editoru:

```html
<iframe src="VASE_GITHUB_URL/banner-summer-sale.html" width="100%" height="400" frameborder="0" scrolling="no"></iframe>
```

*Nezapomeňte nahradit `VASE_GITHUB_URL` skutečným odkazem z GitHub Pages.*
