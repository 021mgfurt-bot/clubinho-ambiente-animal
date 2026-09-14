const WHATSAPP_NUMBER = '5521992985489';
const historyLogo = document.querySelector('.history-logo');
if (historyLogo && historyLogo.tagName === 'IMG') {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    historyLogo.src = 'assets/logo-original.png';
  }
}
document.querySelectorAll('[data-service]').forEach(link => {
  const message = `Olá, tudo bem? Vi o serviço ${link.dataset.service} no site e gostaria de mais informações, incluindo valores e horários disponíveis.`;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});
const taxi = document.getElementById('taxi');
const tosa = document.getElementById('tosa');
const summary = document.getElementById('plan-summary');
const planWhatsapp = document.getElementById('plan-whatsapp');
const planExtras = [
  { id: 'extra-unhas', label: 'corte de unhas' },
  { id: 'extra-ouvido', label: 'limpeza de ouvido' },
  { id: 'extra-hidratacao', label: 'hidratação' },
  { id: 'extra-desembaraco', label: 'desembaraço' },
  { id: 'extra-vacina', label: 'vacina V10' },
].map(extra => ({ ...extra, input: document.getElementById(extra.id) }));
function checkedExtraLabels() {
  return planExtras.filter(extra => extra.input.checked).map(extra => extra.label);
}
function updatePlan() {
  const extras = checkedExtraLabels();
  summary.textContent = 'Seu Clubinho: 4 banhos mensais' + (taxi.checked ? ' + táxi dog' : ', levando e buscando seu pet') + (tosa.checked ? ' + tosa' : '') + (extras.length ? ' + ' + extras.join(', ') : '') + '. ' + ((taxi.checked || tosa.checked || extras.length) ? 'Adicionais cobrados à parte.' : '');
}
function updatePlanWhatsappLink() {
  let message = `Olá, tudo bem? Gostaria de consultar o Clubinho do Pet (4 banhos por mês), ${taxi.checked ? 'com' : 'sem'} táxi dog e ${tosa.checked ? 'com' : 'sem'} tosa.`;
  const extras = checkedExtraLabels();
  if (extras.length) {
    message += ` Também gostaria de consultar: ${extras.join(', ')}.`;
  }
  message += ' Pode me passar os valores e a disponibilidade?';
  planWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function updatePlanCard() {
  updatePlan();
  updatePlanWhatsappLink();
}
const planInputs = [taxi, tosa, ...planExtras.map(extra => extra.input)];
planInputs.forEach(input => input.addEventListener('change', updatePlanCard));
updatePlanWhatsappLink();
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-copy > *', {y:25, opacity:0, duration:.85, stagger:.12, ease:'power3.out', clearProps:'all'});
    gsap.from('.hero-visual', {y:22, opacity:0, duration:1, delay:.15, ease:'power3.out', clearProps:'transform,opacity'});
    gsap.from('.whatsapp-float', {scale:0, opacity:0, duration:.6, delay:.9, ease:'back.out(1.7)', clearProps:'transform'});
    const animateChoice = event => {
      gsap.fromTo(event.currentTarget.closest('label'),{scale:.985},{scale:1,duration:.35,ease:'back.out(1.5)',clearProps:'transform'});
    };
    planInputs.forEach(input => input.addEventListener('change', animateChoice));
    return () => planInputs.forEach(input => input.removeEventListener('change', animateChoice));
  });
  // Scroll-linked reveal only on desktop: on mobile Safari the address-bar
  // resize/inertial scroll makes ScrollTrigger's fire unreliably, leaving
  // sections (notably the reviews) permanently at opacity:0. Below the
  // site's own mobile breakpoint (760px) content simply renders visible.
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 761px)', () => {
    gsap.utils.toArray('.section-heading, .service-grid article, .club-copy, .plan, .about > div, .review-card, .contact').forEach(element => {
      gsap.from(element, {scrollTrigger:{trigger:element,start:'top 92%',once:true}, y:30, opacity:0,duration:.7,ease:'power2.out',clearProps:'all'});
    });
    gsap.to('.photo-tag', {y:-12,rotation:-2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  });
}

const reviewCarousel = document.querySelector('.review-carousel');
const reviewTrack = document.querySelector('.review-track');
if (reviewCarousel && reviewTrack && reviewTrack.children.length >= 2) {
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cards = reviewTrack.children;
  const firstClone = cards[Math.floor(cards.length / 2)];
  let loopWidth = 0;
  let speed = 0;
  let position = 0;
  let dragging = false;
  let dragStartTime = 0;
  let hovering = false;
  let touchResumeAt = 0;
  let axisLocked = null;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startPosition = 0;
  let lastFrameTime = null;

  function measure() {
    // Medido pela posição real do primeiro card clonado (não scrollWidth/2,
    // que fica levemente impreciso por causa do espaçamento entre os cards),
    // pra garantir que o "ponto de virada" do loop seja exato.
    loopWidth = firstClone.offsetLeft - cards[0].offsetLeft;
    const durationMs = window.innerWidth <= 760 ? 68000 : 96000;
    speed = loopWidth > 0 ? loopWidth / durationMs : 0;
    applyTransform();
  }

  function applyTransform() {
    if (loopWidth > 0) {
      position = ((position % loopWidth) + loopWidth) % loopWidth;
    }
    reviewTrack.style.transform = `translateX(${-position}px)`;
  }

  function frame(time) {
    if (lastFrameTime === null) lastFrameTime = time;
    let dt = time - lastFrameTime;
    lastFrameTime = time;
    // Se a aba ficou em segundo plano por um tempo, ignora o salto em vez
    // de pular a posição de uma vez (evita um "pulo" visual ao voltar).
    if (dt > 250) dt = 0;
    // Segurança: se um toque travar sem soltar (gesto interrompido pelo
    // sistema), destrava sozinho depois de alguns segundos em vez de
    // deixar o carrossel parado pra sempre.
    if (dragging && Date.now() - dragStartTime > 8000) {
      dragging = false;
      axisLocked = null;
      reviewCarousel.classList.remove('is-dragging');
    }
    const touchPaused = Date.now() < touchResumeAt;
    if (!dragging && !hovering && !touchPaused && !reduceMotionQuery.matches) {
      position += speed * dt;
      applyTransform();
    }
    requestAnimationFrame(frame);
  }

  function onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startPosition = position;
    axisLocked = null;
  }

  function onPointerMove(event) {
    if (event.pointerId !== pointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!axisLocked) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      axisLocked = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
      if (axisLocked === 'x') {
        dragging = true;
        dragStartTime = Date.now();
        reviewCarousel.classList.add('is-dragging');
        try { reviewCarousel.setPointerCapture(pointerId); } catch (error) {}
      }
    }
    if (axisLocked === 'x') {
      event.preventDefault();
      position = startPosition - deltaX;
      applyTransform();
    }
  }

  function onPointerUp(event) {
    if (event.pointerId !== pointerId) return;
    const wasDragging = dragging;
    if (wasDragging) {
      reviewCarousel.classList.remove('is-dragging');
      try { reviewCarousel.releasePointerCapture(pointerId); } catch (error) {}
    }
    dragging = false;
    axisLocked = null;
    pointerId = null;
    if (wasDragging && event.pointerType !== 'mouse') {
      touchResumeAt = Date.now() + 1500;
    }
  }

  reviewCarousel.addEventListener('pointerdown', onPointerDown);
  reviewCarousel.addEventListener('pointermove', onPointerMove);
  reviewCarousel.addEventListener('pointerup', onPointerUp);
  reviewCarousel.addEventListener('pointercancel', onPointerUp);
  reviewCarousel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') hovering = true;
  });
  reviewCarousel.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') hovering = false;
  });
  document.addEventListener('visibilitychange', () => { lastFrameTime = null; });

  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  requestAnimationFrame(frame);
}
