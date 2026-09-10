# Clubinho Ambiente Animal

Site institucional do Clubinho Ambiente Animal (pet shop de Jorge Loureiro, desde 1996). HTML/CSS/JS puro, sem build tool.

## Estrutura

```
index.html
css/style.css       estilos
js/script.js        simulador do plano "Clubinho do Pet" + animações GSAP
js/motion.js        efeito 3D de bolhas no hero (Three.js)
vendor/              gsap, ScrollTrigger e three.js (vendorizados)
assets/              logo e imagens
```

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```
python -m http.server 8090
```

Depois abra `http://localhost:8090`.

## Deploy

Site 100% estático — pode ser publicado direto em Vercel, Netlify, GitHub Pages ou qualquer hosting estático, sem passo de build.
