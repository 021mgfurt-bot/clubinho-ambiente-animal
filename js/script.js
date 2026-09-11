const WHATSAPP_NUMBER = '5521992985489';
const historyLogo = document.querySelector('.history-logo');
if (historyLogo && historyLogo.tagName === 'VIDEO') {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    historyLogo.removeAttribute('autoplay');
    historyLogo.pause();
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
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-copy > *', {y:25, opacity:0, duration:.85, stagger:.12, ease:'power3.out', clearProps:'all'});
    gsap.from('.hero-visual', {y:22, opacity:0, duration:1, delay:.15, ease:'power3.out', clearProps:'transform,opacity'});
    gsap.utils.toArray('.section-heading, .service-grid article, .club-copy, .plan, .about > div, .review-card, .contact').forEach(element => {
      gsap.from(element, {scrollTrigger:{trigger:element,start:'top 92%',once:true}, y:30, opacity:0,duration:.7,ease:'power2.out',clearProps:'all'});
    });
    gsap.to('.photo-tag', {y:-12,rotation:-2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.from('.whatsapp-float', {scale:0, opacity:0, duration:.6, delay:.9, ease:'back.out(1.7)', clearProps:'transform'});
    const animateChoice = event => {
      gsap.fromTo(event.currentTarget.closest('label'),{scale:.985},{scale:1,duration:.35,ease:'back.out(1.5)',clearProps:'transform'});
    };
    planInputs.forEach(input => input.addEventListener('change', animateChoice));
    return () => planInputs.forEach(input => input.removeEventListener('change', animateChoice));
  });
}
