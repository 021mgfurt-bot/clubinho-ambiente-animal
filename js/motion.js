const mount = document.getElementById('pet-bubbles');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
async function startBubbles() {
  if (motionPreference.matches || navigator.connection?.saveData) return;
  try {
    const THREE = await import('../vendor/three.module.min.js');
    const renderer = new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35,1,.1,30);
    camera.position.z=8;
    scene.add(new THREE.HemisphereLight(0xffffff,0x8ebe9b,2.5));
    const light = new THREE.DirectionalLight(0xffffff,3); light.position.set(-3,4,5); scene.add(light);
    const geometry = new THREE.SphereGeometry(1,20,14);
    const material = new THREE.MeshPhysicalMaterial({color:0xd7f2df,metalness:.15,roughness:.12,transparent:true,opacity:.42,clearcoat:1});
    const bubbles = [[-1.7,1.8,.26],[1.5,.1,.34],[-1.4,-1.7,.17],[1.65,2.3,.18]].map(([x,y,scale])=>{
      const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,1);mesh.scale.setScalar(scale);scene.add(mesh);return {mesh,x,y};
    });
    function resize(){const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
    new ResizeObserver(resize).observe(mount);resize();
    let visible=true, pointerX=0,pointerY=0;
    const hero=document.querySelector('.hero-visual');
    hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;});
    hero.addEventListener('pointerleave',()=>{pointerX=pointerY=0;});
    const animate=time=>{const t=time*.0005;bubbles.forEach(({mesh,x,y},i)=>{mesh.position.x=x+Math.sin(t+i)*.08+pointerX*.16;mesh.position.y=y+Math.sin(t*1.2+i)*.14-pointerY*.16;});renderer.render(scene,camera);};
    const sync=()=>renderer.setAnimationLoop(visible&&!document.hidden&&!motionPreference.matches?animate:null);
    new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(hero);
    document.addEventListener('visibilitychange',sync);motionPreference.addEventListener('change',()=>{mount.hidden=motionPreference.matches;sync();});
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);mount.hidden=true;});
    sync();
  } catch { mount.hidden=true; }
}
if ('requestIdleCallback' in window) requestIdleCallback(startBubbles); else setTimeout(startBubbles,500);
