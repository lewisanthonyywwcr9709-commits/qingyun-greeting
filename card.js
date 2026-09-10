(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const card=$('card'),cover=$('cover'),letter=$('letter'),open=$('open-card'),music=$('music'),musicToggle=$('music-toggle'),status=$('status'),fallback=$('copy-fallback');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let musicPreference=true,quiet=reduced.matches;
 music.volume=.48;music.loop=true;music.autoplay=true;
 function syncMusic(){const playing=!music.paused;musicToggle.setAttribute('aria-pressed',String(playing));musicToggle.setAttribute('aria-label',playing?'暂停配乐':'播放配乐');musicToggle.title=playing?'暂停配乐':'播放配乐';}
 async function playMusic(){if(!musicPreference)return;try{await music.play();if(!musicPreference)music.pause();}catch{}syncMusic();}
 musicToggle.addEventListener('click',()=>{if(music.paused){musicPreference=true;playMusic();}else{musicPreference=false;music.pause();}});
 music.addEventListener('play',syncMusic);music.addEventListener('pause',syncMusic);
 function resumeOnGesture(e){if(musicToggle.contains(e.target))return;if(musicPreference&&music.paused)playMusic();}
 document.addEventListener('pointerdown',resumeOnGesture);document.addEventListener('touchend',resumeOnGesture,{passive:true});document.addEventListener('keydown',resumeOnGesture);document.addEventListener('WeixinJSBridgeReady',playMusic);music.addEventListener('canplay',()=>{if(musicPreference&&music.paused)playMusic();},{once:true});playMusic();
 open.addEventListener('click',()=>{cover.inert=true;letter.inert=false;open.setAttribute('aria-expanded','true');card.classList.add('open');playMusic();burst();setTimeout(()=>{if(card.classList.contains('open'))$('recipient').focus({preventScroll:true});},reduced.matches?0:1100);});
 $('replay-card').addEventListener('click',()=>{cover.inert=false;letter.inert=true;card.classList.remove('open');open.setAttribute('aria-expanded','false');status.textContent='';fallback.hidden=true;open.focus({preventScroll:true});card.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});});
 const url=new URL(location.href);url.search='';url.hash='';const canonical=url.href;
 function manualCopy(){fallback.hidden=false;$('share-url').value=canonical;$('share-url').focus();$('share-url').select();status.textContent='复制链接后，可发给陈甫乙或转给其他朋友。';}
 $('share-card').addEventListener('click',async()=>{status.textContent='';fallback.hidden=true;if(/MicroMessenger/i.test(navigator.userAgent)){status.textContent='请点微信右上角“…” → “发送给朋友”，分享这封贺笺。';return;}if(navigator.share){try{await navigator.share({title:'敬贺陈甫乙履新',text:'鲲鹏展翅凌万里，骏马扬鞭赴新程。',url:canonical});return;}catch(e){if(e.name==='AbortError')return;}}try{if(!navigator.clipboard||!isSecureContext){manualCopy();return;}await navigator.clipboard.writeText(canonical);status.textContent='链接已复制，朋友打开后也可以继续分享。';}catch{manualCopy();}});
 const canvas=$('effects'),ctx=canvas.getContext('2d');let w=0,h=0,frame=0,last=0,particles=[];
 const motion=$('motion-toggle');
 function syncMotion(){card.classList.toggle('quiet',quiet);motion.textContent=quiet?'动':'静';motion.setAttribute('aria-pressed',String(quiet));motion.setAttribute('aria-label',quiet?'开启画面动效':'暂停画面动效');motion.title=quiet?'开启画面动效':'暂停画面动效';}
 function resize(){w=card.clientWidth;h=card.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);}
 function makeParticle(x,y,boost=false){return{x:x??Math.random()*w,y:y??Math.random()*h,size:Math.random()*(boost?2.6:1.4)+.4,life:0,max:boost?75+Math.random()*45:190+Math.random()*200,vx:boost?Math.random()*3+.5:Math.random()*.2+.06,vy:boost?-Math.random()*3.4-1:-Math.random()*.16-.03,gold:Math.random()>.3};}
 function burst(){if(quiet||reduced.matches||!ctx)return;for(let i=0;i<45;i++)particles.push(makeParticle(w*.35+Math.random()*w*.25,h*.52,true));}
 function draw(t){frame=0;if(quiet||reduced.matches||document.hidden||!ctx)return;frame=requestAnimationFrame(draw);if(t-last<33)return;last=t;ctx.clearRect(0,0,w,h);const desired=card.classList.contains('open')?10:23;if(particles.length<desired)particles.push(makeParticle());particles=particles.filter(p=>p.life<p.max&&p.y>-20&&p.x<w+20);for(const p of particles){p.life++;p.x+=p.vx;p.y+=p.vy;const a=Math.sin(Math.PI*p.life/p.max)*(p.gold?.55:.16);ctx.fillStyle=p.gold?`rgba(147,112,50,${a})`:`rgba(33,66,53,${a})`;ctx.beginPath();ctx.ellipse(p.x,p.y,p.size,p.size*.4,-.65,0,Math.PI*2);ctx.fill();}}
 function start(){cancelAnimationFrame(frame);frame=0;if(!quiet&&!reduced.matches&&!document.hidden&&ctx)frame=requestAnimationFrame(draw);}
 motion.addEventListener('click',()=>{quiet=!quiet;syncMotion();start();});
 const onMotionPreference=()=>{quiet=reduced.matches;syncMotion();start();};
 if(reduced.addEventListener)reduced.addEventListener('change',onMotionPreference);else if(reduced.addListener)reduced.addListener(onMotionPreference);
 document.addEventListener('visibilitychange',start);
 if(ctx){resize();if(window.ResizeObserver)new ResizeObserver(resize).observe(card);else window.addEventListener('resize',resize);for(let i=0;i<18;i++)particles.push(makeParticle());}syncMotion();start();
})();
