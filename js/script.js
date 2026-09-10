const taxi = document.getElementById('taxi');
const tosa = document.getElementById('tosa');
const summary = document.getElementById('plan-summary');
function updatePlan() {
  summary.textContent = 'Seu Clubinho: 4 banhos mensais' + (taxi.checked ? ' + táxi dog' : ', levando e buscando seu pet') + (tosa.checked ? ' + tosa' : '') + '. ' + ((taxi.checked || tosa.checked) ? 'Adicionais cobrados à parte.' : '');
}
taxi.addEventListener('change', updatePlan);
tosa.addEventListener('change', updatePlan);
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-copy > *', {y:25, opacity:0, duration:.85, stagger:.12, ease:'power3.out', clearProps:'all'});
    gsap.from('.hero-visual', {y:22, opacity:0, duration:1, delay:.15, ease:'power3.out', clearProps:'transform,opacity'});
    gsap.utils.toArray('.section-heading, .service-grid article, .club-copy, .plan, .about > div, .contact').forEach(element => {
      gsap.from(element, {scrollTrigger:{trigger:element,start:'top 92%',once:true}, y:30, opacity:0,duration:.7,ease:'power2.out',clearProps:'all'});
    });
    gsap.to('.photo-tag', {y:-12,rotation:-2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    const animateChoice = event => {
      gsap.fromTo(event.currentTarget.closest('label'),{scale:.985},{scale:1,duration:.35,ease:'back.out(1.5)',clearProps:'transform'});
    };
    [taxi,tosa].forEach(input => input.addEventListener('change', animateChoice));
    return () => [taxi,tosa].forEach(input => input.removeEventListener('change', animateChoice));
  });
}
