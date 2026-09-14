# Clubinho Ambiente Animal

Site institucional do Clubinho Ambiente Animal (pet shop de Jorge Loureiro, desde 1996). HTML/CSS/JS puro, sem build tool.

## Estrutura

```
index.html                       home (única página de conteúdo do site)
404.html                         página de erro personalizada
politica-de-privacidade.html     LGPD
termos-de-uso.html               condições de uso
css/style.css                    estilos
js/script.js                     simulador do plano "Clubinho do Pet", carrossel de avaliações (drag) + animações GSAP
js/motion.js                     efeito 3D de bolhas no hero (Three.js)
vendor/                          gsap, ScrollTrigger e three.js (vendorizados)
assets/                          logo, favicons, fontes, imagens e vídeo
vercel.json                      headers de segurança (CSP, HSTS etc.)
robots.txt, sitemap.xml          indexação
```

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```
python -m http.server 8090
```

Depois abra `http://localhost:8090`.

Obs.: `/_vercel/insights/script.js` (Vercel Analytics) só existe em produção — localmente ele dá 404 de forma inofensiva, sem quebrar nada.

## Deploy

O site é publicado na **Vercel**, direto a partir da branch `main` deste repositório (sem passo de build — projeto configurado como estático/"Other").

Checklist ao configurar o projeto na Vercel:

1. Importar este repositório no [dashboard da Vercel](https://vercel.com/new).
2. Conferir que o **Framework Preset** está como "Other" (sem build command, sem output directory customizado).
3. Configurar o domínio `clubinhoambienteanimal.com.br` em Project Settings → Domains.
4. Habilitar **Web Analytics** em Project Settings → Analytics (o script já está incluído em todas as páginas — sem isso habilitado, ele não coleta nada).
5. `vercel.json` já cuida dos headers de segurança automaticamente, sem configuração manual adicional.

## Documentos legais / LGPD

- [`politica-de-privacidade.html`](politica-de-privacidade.html) e [`termos-de-uso.html`](termos-de-uso.html) refletem o que o site realmente faz: sem formulário, sem cadastro, sem cookies de rastreamento.
- Contato para assuntos de privacidade: jorg.silvia@hotmail.com
- Se o site ganhar um formulário, cookies ou um script de terceiros (Google Analytics, Meta Pixel etc.) no futuro, **revisite esses dois documentos e a necessidade de um banner de consentimento** — hoje eles não existem porque não são necessários.

## Analytics

Vercel Analytics (cookieless, sem dado pessoal) — não precisa de banner de consentimento. Ative em Project Settings → Analytics no painel da Vercel.

## Segurança

Headers de segurança (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) ficam em `vercel.json`. Qualquer nova origem externa adicionada ao site (script, fonte, imagem de terceiro) precisa ser refletida na Content-Security-Policy desse arquivo, senão o navegador vai bloquear.
