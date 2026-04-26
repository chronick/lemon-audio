let et=null;function dt(){return et||(et=new AudioContext),et}function mt(){const d=dt();return d.state==="suspended"?d.resume():Promise.resolve()}function j(d){return 440*Math.pow(2,(d-69)/12)}const t={vel:0},o=d=>({vel:d}),r=(d,e=!1,a=!1)=>({note:d,accent:e,slide:a}),n=null,v=33,N=36,O=38,q=40,X=43,V=45,ft=48,P=[57,60,64],nt=[62,65,69],rt=[52,55,59],xt=[53,57,60],w=(d,e=.8)=>({notes:d,vel:e}),z=[{name:"FOUR FLOOR",energy:"mid",kick:[o(1),t,t,t,o(1),t,t,t,o(1),t,t,t,o(1),t,t,t],hat:[t,t,o(.6),t,t,t,o(.6),t,t,t,o(.6),t,t,t,o(.6),t],clap:[t,t,t,t,o(.9),t,t,t,t,t,t,t,o(.9),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"DRIVING",energy:"high",kick:[o(1),t,t,t,o(1),t,t,o(.7),o(1),t,t,t,o(1),t,t,t],hat:[o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5)],clap:[t,t,t,t,o(1),t,t,t,t,t,t,t,o(1),t,t,o(.5)],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"MINIMAL",energy:"mid",kick:[o(1),t,t,t,t,t,t,t,o(.9),t,t,t,t,t,t,t],hat:[t,t,t,t,t,t,o(.4),t,t,t,t,t,t,t,o(.4),t],clap:[t,t,t,t,o(.7),t,t,t,t,t,t,t,o(.7),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"POUNDING",energy:"high",kick:[o(1),t,t,o(.6),o(1),t,t,t,o(1),t,t,o(.7),o(1),t,t,t],hat:[o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t],clap:[t,t,t,t,o(1),t,t,o(.4),t,t,t,t,o(1),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,o(.3),t]},{name:"SYNCOPATED",energy:"mid",kick:[o(1),t,t,t,o(.8),t,o(.7),t,o(1),t,t,t,o(.8),t,o(.6),t],hat:[t,t,o(.5),t,t,t,o(.5),t,t,t,o(.5),t,t,t,o(.5),o(.3)],clap:[t,t,t,t,o(.9),t,t,t,t,t,t,o(.5),t,t,o(.8),t],ride:[o(.3),t,t,t,t,t,t,t,o(.3),t,t,t,t,t,t,t]},{name:"HEARTBEAT",energy:"low",kick:[o(.7),t,t,t,t,t,t,t,o(.5),t,t,t,t,t,t,t],hat:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t],clap:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"STUMBLE",energy:"low",kick:[o(.8),t,t,t,t,o(.3),t,t,t,t,t,o(.5),t,t,t,t],hat:[t,t,t,t,t,t,t,o(.15),t,t,t,t,t,t,t,t],clap:[t,t,t,t,t,t,t,t,t,t,t,t,o(.3),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]}],_=[{name:"CLASSIC",energy:"mid",steps:[r(v,!0),n,r(N),r(q,!1,!0),r(v,!0),n,r(O),n,r(v),r(X,!0,!0),r(q),n,r(v,!0),n,r(N,!1,!0),r(O)]},{name:"HYPNOTIC",energy:"mid",steps:[r(v,!0),r(v),n,r(v),r(v,!0),n,r(N,!1,!0),r(v),r(v,!0),r(v),n,r(v),r(v,!0),n,r(q,!0,!0),r(O,!1,!0)]},{name:"WANDERER",energy:"mid",steps:[r(v,!0),n,r(q,!1,!0),r(X),r(V,!0,!0),n,r(O),n,r(N,!0),n,r(X,!1,!0),r(V,!0),n,r(q),r(O,!1,!0),r(v,!0)]},{name:"STABBY",energy:"high",steps:[r(V,!0),n,n,r(V,!0),n,n,r(q,!0),n,r(V,!0),n,n,r(ft,!0),n,r(V,!0),n,n]},{name:"DEEP",energy:"mid",steps:[r(v),r(v,!1,!0),r(v),n,r(N,!0,!0),r(N),n,r(v),r(v),r(v,!1,!0),n,r(O,!0),r(N,!1,!0),r(v),n,n]},{name:"RELENTLESS",energy:"high",steps:[r(v,!0),r(N),r(v),r(q,!0,!0),r(v),r(O,!0),r(v),r(N,!1,!0),r(v,!0),r(X,!1,!0),r(v),r(q,!0),r(O),r(v,!0),r(N,!1,!0),r(v)]},{name:"DRIP",energy:"low",steps:[r(V,!0),n,n,n,n,n,n,n,n,n,n,n,n,n,r(v,!1,!0),n]},{name:"CRAWL",energy:"low",steps:[r(v),n,r(v,!1,!0),n,n,r(N,!1,!0),n,n,r(O,!1,!0),n,n,n,n,n,r(v,!1,!0),n]}],J=[{name:"OFFBEAT STABS",energy:"mid",steps:[n,n,w(P),n,n,n,w(P,.6),n,n,n,w(P),n,n,n,w(P,.6),n]},{name:"CHORD HITS",energy:"mid",steps:[w(P),n,n,n,w(nt,.7),n,n,n,w(P),n,n,n,w(rt,.7),n,n,n]},{name:"ARPEGGIO",energy:"mid",steps:[w([57]),n,w([60]),n,w([64]),n,w([60]),n,w([57]),n,w([60]),n,w([64],.6),n,w([67],.5),n]},{name:"SPARSE PAD",energy:"low",steps:[w(P,.5),n,n,n,n,n,n,n,w(xt,.4),n,n,n,n,n,n,n]},{name:"RHYTHMIC",energy:"high",steps:[w(P,.9),n,w(P,.4),n,n,w(P,.6),n,w(P,.3),w(nt,.8),n,w(nt,.4),n,n,w(P,.5),n,n]},{name:"FOG",energy:"low",steps:[w(P,.2),n,n,n,n,n,n,n,n,n,n,n,n,n,w(rt,.15),n]},{name:"FLICKER",energy:"low",steps:[n,n,n,w([64],.2),n,n,n,n,n,w([60],.15),n,n,n,n,n,n]}],tt=[{name:"WASH",energy:"mid",type:"wash",filterFreq:2e3,filterQ:1,lfoRate:.1,gain:.15},{name:"DRONE",energy:"mid",type:"drone",filterFreq:400,filterQ:3,lfoRate:.05,gain:.2},{name:"SWEEP",energy:"high",type:"sweep",filterFreq:800,filterQ:5,lfoRate:.3,gain:.12},{name:"RUMBLE",energy:"mid",type:"rumble",filterFreq:150,filterQ:2,lfoRate:.08,gain:.25},{name:"SHIMMER",energy:"mid",type:"shimmer",filterFreq:6e3,filterQ:2,lfoRate:.2,gain:.08},{name:"VOID",energy:"low",type:"drone",filterFreq:120,filterQ:4,lfoRate:.03,gain:.08},{name:"BREATH",energy:"low",type:"wash",filterFreq:600,filterQ:1.5,lfoRate:.18,gain:.05}],yt=138,st=16;class gt{ctx;masterGain;limiter;kickGain;percGain;acidGain;synthGain;atmoGain;kickDrive;kickComp;percComp;acidFilter;synthFilter;atmoReverb;atmoReverbGain;atmoDryGain;atmoNoise=null;atmoLfo=null;atmoLfoGain=null;atmoNoiseFilter=null;schedulerTimer=null;nextStepTime=0;LOOK_AHEAD=.1;SCHEDULE_INTERVAL=25;kickPatterns=[];acidPatterns=[];synthPatterns=[];atmoPresets=[];state={playing:!1,bpm:yt,currentStep:0,kick:{muted:!1,level:.8,patternIndex:0,drive:.3},perc:{muted:!1,level:.7,patternIndex:0,tone:.5},acid:{muted:!1,level:.75,patternIndex:0,cutoff:.5,resonance:.6},synth:{muted:!1,level:.5,patternIndex:0,cutoff:.7,release:.4},atmo:{muted:!0,level:.5,patternIndex:0,reverb:.7}};stepCallbacks=[];lastAcidFreq=j(33);init(e,a,i,l){this.ctx=dt(),this.kickPatterns=e,this.acidPatterns=a,this.synthPatterns=i,this.atmoPresets=l,this.limiter=this.ctx.createDynamicsCompressor(),this.limiter.threshold.value=-3,this.limiter.knee.value=3,this.limiter.ratio.value=12,this.limiter.attack.value=.001,this.limiter.release.value=.1,this.limiter.connect(this.ctx.destination),this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=.8,this.masterGain.connect(this.limiter),this.buildKickChain(),this.buildPercChain(),this.buildAcidChain(),this.buildSynthChain(),this.buildAtmoChain()}buildKickChain(){this.kickComp=this.ctx.createDynamicsCompressor(),this.kickComp.threshold.value=-15,this.kickComp.ratio.value=4,this.kickComp.attack.value=.003,this.kickComp.release.value=.15,this.kickDrive=this.ctx.createWaveShaper(),this.updateDriveCurve(this.state.kick.drive),this.kickGain=this.ctx.createGain(),this.kickGain.gain.value=this.state.kick.level,this.kickGain.connect(this.kickDrive),this.kickDrive.connect(this.kickComp),this.kickComp.connect(this.masterGain)}buildPercChain(){this.percComp=this.ctx.createDynamicsCompressor(),this.percComp.threshold.value=-18,this.percComp.ratio.value=3,this.percComp.attack.value=.001,this.percComp.release.value=.1,this.percGain=this.ctx.createGain(),this.percGain.gain.value=this.state.perc.level,this.percGain.connect(this.percComp),this.percComp.connect(this.masterGain)}buildAcidChain(){this.acidFilter=this.ctx.createBiquadFilter(),this.acidFilter.type="lowpass",this.acidFilter.frequency.value=this.cutoffToFreq(this.state.acid.cutoff),this.acidFilter.Q.value=this.state.acid.resonance*25,this.acidGain=this.ctx.createGain(),this.acidGain.gain.value=this.state.acid.level,this.acidGain.connect(this.acidFilter),this.acidFilter.connect(this.masterGain)}buildSynthChain(){this.synthFilter=this.ctx.createBiquadFilter(),this.synthFilter.type="lowpass",this.synthFilter.frequency.value=this.cutoffToFreq(this.state.synth.cutoff),this.synthFilter.Q.value=2,this.synthGain=this.ctx.createGain(),this.synthGain.gain.value=this.state.synth.level,this.synthGain.connect(this.synthFilter),this.synthFilter.connect(this.masterGain)}buildAtmoChain(){this.atmoReverb=this.ctx.createConvolver(),this.atmoReverb.buffer=this.generateImpulse(3,4),this.atmoReverbGain=this.ctx.createGain(),this.atmoReverbGain.gain.value=this.state.atmo.reverb,this.atmoDryGain=this.ctx.createGain(),this.atmoDryGain.gain.value=1-this.state.atmo.reverb,this.atmoGain=this.ctx.createGain(),this.atmoGain.gain.value=this.state.atmo.level,this.atmoGain.connect(this.atmoDryGain),this.atmoDryGain.connect(this.masterGain),this.atmoGain.connect(this.atmoReverb),this.atmoReverb.connect(this.atmoReverbGain),this.atmoReverbGain.connect(this.masterGain)}playKick(e,a){const i=this.ctx.createOscillator(),l=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(150,e),i.frequency.exponentialRampToValueAtTime(45,e+.07),l.gain.setValueAtTime(a,e),l.gain.exponentialRampToValueAtTime(.001,e+.4),i.connect(l),l.connect(this.kickGain),i.start(e),i.stop(e+.45)}playHat(e,a,i=!1){const l=this.ctx.sampleRate*(i?.15:.04),m=this.ctx.createBuffer(1,l,this.ctx.sampleRate),x=m.getChannelData(0);for(let b=0;b<l;b++)x[b]=(Math.random()*2-1)*a;const f=this.ctx.createBufferSource();f.buffer=m;const h=this.ctx.createBiquadFilter();h.type="highpass",h.frequency.value=5e3+this.state.perc.tone*7e3;const y=this.ctx.createBiquadFilter();y.type="bandpass",y.frequency.value=8e3+this.state.perc.tone*4e3,y.Q.value=1.5;const u=this.ctx.createGain();u.gain.setValueAtTime(a*.6,e),u.gain.exponentialRampToValueAtTime(.001,e+(i?.15:.04)),f.connect(h),h.connect(y),y.connect(u),u.connect(this.percGain),f.start(e)}playClap(e,a){for(let l=0;l<3;l++){const m=e+l*.01,x=this.ctx.sampleRate*.02,f=this.ctx.createBuffer(1,x,this.ctx.sampleRate),h=f.getChannelData(0);for(let g=0;g<x;g++)h[g]=Math.random()*2-1;const y=this.ctx.createBufferSource();y.buffer=f;const u=this.ctx.createBiquadFilter();u.type="bandpass",u.frequency.value=1200,u.Q.value=2;const b=this.ctx.createGain();b.gain.setValueAtTime(a*.4,m),b.gain.exponentialRampToValueAtTime(.001,m+.08),y.connect(u),u.connect(b),b.connect(this.percGain),y.start(m)}}playRide(e,a){const i=this.ctx.sampleRate*.3,l=this.ctx.createBuffer(1,i,this.ctx.sampleRate),m=l.getChannelData(0);for(let y=0;y<i;y++)m[y]=Math.random()*2-1;const x=this.ctx.createBufferSource();x.buffer=l;const f=this.ctx.createBiquadFilter();f.type="highpass",f.frequency.value=7e3;const h=this.ctx.createGain();h.gain.setValueAtTime(a*.3,e),h.gain.exponentialRampToValueAtTime(.001,e+.3),x.connect(f),f.connect(h),h.connect(this.percGain),x.start(e)}playAcidNote(e,a,i,l){const m=j(a),x=60/this.state.bpm/4,f=this.ctx.createOscillator();f.type="sawtooth",l?(f.frequency.setValueAtTime(this.lastAcidFreq,e),f.frequency.exponentialRampToValueAtTime(m,e+x*.5)):f.frequency.setValueAtTime(m,e);const h=this.ctx.createBiquadFilter();h.type="lowpass";const y=this.cutoffToFreq(this.state.acid.cutoff),u=i?5e3:2500;h.frequency.setValueAtTime(y+u,e),h.frequency.exponentialRampToValueAtTime(Math.max(y,60),e+x*.8),h.Q.value=this.state.acid.resonance*20;const b=this.ctx.createGain(),g=i?.45:.3;b.gain.setValueAtTime(g,e),l?b.gain.setValueAtTime(g,e+x):(b.gain.setValueAtTime(g,e+x*.7),b.gain.exponentialRampToValueAtTime(.001,e+x*.95)),f.connect(h),h.connect(b),b.connect(this.acidGain),f.start(e),f.stop(e+x*1.1),this.lastAcidFreq=m}playSynthChord(e,a,i){const l=60/this.state.bpm/4,m=.05+this.state.synth.release*.4;for(const x of a){const f=j(x),h=this.ctx.createOscillator(),y=this.ctx.createOscillator();h.type="sawtooth",y.type="sawtooth",h.frequency.value=f,y.frequency.value=f*1.005;const u=this.ctx.createGain(),b=i*.12;u.gain.setValueAtTime(.001,e),u.gain.linearRampToValueAtTime(b,e+.005),u.gain.setValueAtTime(b,e+l*.6),u.gain.exponentialRampToValueAtTime(.001,e+l*.6+m),h.connect(u),y.connect(u),u.connect(this.synthGain),h.start(e),y.start(e),h.stop(e+l+m+.1),y.stop(e+l+m+.1)}}startAtmo(){this.stopAtmo();const e=this.atmoPresets[this.state.atmo.patternIndex];if(!e)return;const a=this.ctx.sampleRate*4,i=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=i.getChannelData(0);if(e.type==="rumble"||e.type==="drone"){let x=0;for(let f=0;f<a;f++){const h=Math.random()*2-1;x=(x+.02*h)/1.02,l[f]=x*3.5}}else for(let x=0;x<a;x++)l[x]=Math.random()*2-1;this.atmoNoise=this.ctx.createBufferSource(),this.atmoNoise.buffer=i,this.atmoNoise.loop=!0,this.atmoNoiseFilter=this.ctx.createBiquadFilter(),this.atmoNoiseFilter.type=e.type==="shimmer"?"highpass":"lowpass",this.atmoNoiseFilter.frequency.value=e.filterFreq,this.atmoNoiseFilter.Q.value=e.filterQ,this.atmoLfo=this.ctx.createOscillator(),this.atmoLfo.type="sine",this.atmoLfo.frequency.value=e.lfoRate,this.atmoLfoGain=this.ctx.createGain(),this.atmoLfoGain.gain.value=e.filterFreq*.5,this.atmoLfo.connect(this.atmoLfoGain),this.atmoLfoGain.connect(this.atmoNoiseFilter.frequency);const m=this.ctx.createGain();m.gain.value=e.gain,this.atmoNoise.connect(this.atmoNoiseFilter),this.atmoNoiseFilter.connect(m),m.connect(this.atmoGain),this.atmoNoise.start(),this.atmoLfo.start()}stopAtmo(){try{this.atmoNoise?.stop()}catch{}try{this.atmoLfo?.stop()}catch{}this.atmoNoise=null,this.atmoLfo=null,this.atmoLfoGain=null,this.atmoNoiseFilter=null}onStep(e){this.stepCallbacks.push(e)}async start(){await mt(),this.state.playing=!0,this.state.currentStep=0,this.nextStepTime=this.ctx.currentTime+.05,this.lastAcidFreq=j(33),this.state.atmo.muted||this.startAtmo(),this.schedule()}stop(){this.state.playing=!1,this.schedulerTimer!==null&&(clearTimeout(this.schedulerTimer),this.schedulerTimer=null),this.stopAtmo()}schedule(){if(!this.state.playing)return;const e=60/this.state.bpm/4;for(;this.nextStepTime<this.ctx.currentTime+this.LOOK_AHEAD;){this.triggerStep(this.state.currentStep,this.nextStepTime);const a=this.state.currentStep,i=this.nextStepTime,l=Math.max(0,(i-this.ctx.currentTime)*1e3);setTimeout(()=>{for(const m of this.stepCallbacks)m(a)},l),this.nextStepTime+=e,this.state.currentStep=(this.state.currentStep+1)%st}this.schedulerTimer=window.setTimeout(()=>this.schedule(),this.SCHEDULE_INTERVAL)}triggerStep(e,a){if(!this.state.kick.muted){const i=this.kickPatterns[this.state.kick.patternIndex];i&&(i.kick[e]?.vel&&this.playKick(a,i.kick[e].vel),i.hat[e]?.vel&&this.playHat(a,i.hat[e].vel),i.clap[e]?.vel&&this.playClap(a,i.clap[e].vel),i.ride[e]?.vel&&this.playRide(a,i.ride[e].vel))}if(!this.state.acid.muted){const l=this.acidPatterns[this.state.acid.patternIndex]?.steps[e];l&&this.playAcidNote(a,l.note,l.accent,l.slide)}if(!this.state.synth.muted){const l=this.synthPatterns[this.state.synth.patternIndex]?.steps[e];l&&this.playSynthChord(a,l.notes,l.vel)}}setChannelLevel(e,a){this.state[e].level=a,{kick:this.kickGain,perc:this.percGain,acid:this.acidGain,synth:this.synthGain,atmo:this.atmoGain}[e].gain.setTargetAtTime(a,this.ctx.currentTime,.02)}setMuted(e,a){this.state[e].muted=a,e==="atmo"&&(a?this.stopAtmo():this.state.playing&&this.startAtmo())}setKickDrive(e){this.state.kick.drive=e,this.updateDriveCurve(e)}setPercTone(e){this.state.perc.tone=e}setAcidCutoff(e){this.state.acid.cutoff=e,this.acidFilter.frequency.setTargetAtTime(this.cutoffToFreq(e),this.ctx.currentTime,.02)}setAcidResonance(e){this.state.acid.resonance=e,this.acidFilter.Q.setTargetAtTime(e*25,this.ctx.currentTime,.02)}setSynthCutoff(e){this.state.synth.cutoff=e,this.synthFilter.frequency.setTargetAtTime(this.cutoffToFreq(e),this.ctx.currentTime,.02)}setSynthRelease(e){this.state.synth.release=e}setAtmoReverb(e){this.state.atmo.reverb=e,this.atmoReverbGain.gain.setTargetAtTime(e,this.ctx.currentTime,.05),this.atmoDryGain.gain.setTargetAtTime(1-e*.5,this.ctx.currentTime,.05)}setPattern(e,a){this.state[e].patternIndex=a,e==="atmo"&&this.state.playing&&!this.state.atmo.muted&&this.startAtmo()}setBpm(e){this.state.bpm=Math.max(80,Math.min(180,e))}getEnergy(){let e=0,a=0,i=0;return this.state.kick.muted||(e+=this.state.kick.level*.8),this.state.acid.muted||(e+=this.state.acid.level*.4,a+=this.state.acid.level*this.state.acid.cutoff*.6),this.state.perc.muted||(i+=this.state.perc.level*.7),this.state.synth.muted||(a+=this.state.synth.level*.6,i+=this.state.synth.level*this.state.synth.cutoff*.3),this.state.atmo.muted||(a+=this.state.atmo.level*.2),{total:Math.min(1,(e+a+i)/2.5),low:Math.min(1,e),mid:Math.min(1,a),high:Math.min(1,i)}}getSnapshot(){return JSON.parse(JSON.stringify(this.state))}applyParameterMap(e){const a={kickLevel:i=>this.setChannelLevel("kick",i),percLevel:i=>this.setChannelLevel("perc",i),acidLevel:i=>this.setChannelLevel("acid",i),synthLevel:i=>this.setChannelLevel("synth",i),atmoLevel:i=>this.setChannelLevel("atmo",i),kickDrive:i=>this.setKickDrive(i),percTone:i=>this.setPercTone(i),acidCutoff:i=>this.setAcidCutoff(i),acidResonance:i=>this.setAcidResonance(i),synthCutoff:i=>this.setSynthCutoff(i),synthRelease:i=>this.setSynthRelease(i),atmoReverb:i=>this.setAtmoReverb(i)};for(const[i,l]of Object.entries(e))l!==void 0&&a[i]&&a[i](l)}applySnapshot(e){const a=["kick","perc","acid","synth","atmo"];for(const i of a)this.setChannelLevel(i,e[i].level),this.setMuted(i,e[i].muted),this.setPattern(i,e[i].patternIndex);this.setKickDrive(e.kick.drive),this.setPercTone(e.perc.tone),this.setAcidCutoff(e.acid.cutoff),this.setAcidResonance(e.acid.resonance),this.setSynthCutoff(e.synth.cutoff),this.setSynthRelease(e.synth.release),this.setAtmoReverb(e.atmo.reverb),this.setBpm(e.bpm)}cutoffToFreq(e){return 60*Math.pow(200,e)}updateDriveCurve(e){const i=new Float32Array(256),l=e*50;for(let m=0;m<256;m++){const x=m*2/256-1;i[m]=(1+l)*x/(1+l*Math.abs(x))}this.kickDrive.curve=i,this.kickDrive.oversample="4x"}generateImpulse(e,a){const i=this.ctx.sampleRate*e,l=this.ctx.createBuffer(2,i,this.ctx.sampleRate);for(let m=0;m<2;m++){const x=l.getChannelData(m);for(let f=0;f<i;f++)x[f]=(Math.random()*2-1)*Math.pow(1-f/i,a)}return l}destroy(){this.stop(),this.stepCallbacks=[]}}const s={bgDeep:"#0a0a0f",accent:"#CCFF00",accentGlow:"rgba(204, 255, 0, 0.4)",neonYellow:"#FFFF00",neonPink:"#FF10F0",neonCyan:"#00FFFF",neonGreen:"#39FF14",textDim:"#555568",fontMono:"Menlo, Monaco, Consolas, 'Courier New', monospace"};function K(d,e,a){return Math.max(e,Math.min(a,d))}function I(d,e){const a=document.createElementNS("http://www.w3.org/2000/svg",d);for(const[i,l]of Object.entries(e))a.setAttribute(i,String(l));return a}function bt(d){let i=d.state.acid.cutoff,l=1-d.state.acid.resonance,m=0,x=!1;const f=document.createElement("div");f.style.cssText="position:relative;width:160px;height:120px;cursor:crosshair;flex-shrink:0;";const h=I("svg",{width:160,height:120,viewBox:"0 0 160 120"});h.style.cssText="display:block;border:1px solid rgba(57,255,20,0.2);background:rgba(57,255,20,0.02);",f.appendChild(h);const y=I("path",{fill:"none",stroke:s.neonGreen,"stroke-width":"1",opacity:"0.4"});h.appendChild(y);for(let c=1;c<4;c++)h.appendChild(I("line",{x1:160/4*c,y1:0,x2:160/4*c,y2:120,stroke:"rgba(255,255,255,0.04)","stroke-width":"1"})),h.appendChild(I("line",{x1:0,y1:120/4*c,x2:160,y2:120/4*c,stroke:"rgba(255,255,255,0.04)","stroke-width":"1"}));const u=I("circle",{r:5,fill:s.neonGreen,opacity:"0.9"});h.appendChild(u);const b=I("circle",{r:12,fill:"none",stroke:s.neonGreen,"stroke-width":"1",opacity:"0.3"});h.appendChild(b);const g=`position:absolute;font-size:0.45rem;color:${s.textDim};font-family:${s.fontMono};pointer-events:none;`,D=document.createElement("span");D.style.cssText=g+"top:2px;left:50%;transform:translateX(-50%);",D.textContent="CUTOFF × RESO",f.appendChild(D);function L(){const c=i,C=1-l,E=[],R=60*Math.pow(200,c),A=C*25;for(let B=0;B<64;B++){const W=B/63*160,p=20*Math.pow(1e3,B/63)/R;let Q=1/Math.sqrt(Math.pow(1-p*p,2)+Math.pow(p/Math.max(A,.5),2));A>1&&p>.7&&p<1.4&&(Q*=1+(A-1)*.1*Math.exp(-Math.pow((p-1)*5,2)));const pt=20*Math.log10(Math.max(Q,.001)),ut=120*.5-pt*(120/60);E.push(`${B===0?"M":"L"}${W.toFixed(1)},${K(ut,2,118).toFixed(1)}`)}y.setAttribute("d",E.join(" "))}function S(){const c=i*160,C=l*120;u.setAttribute("cx",String(c)),u.setAttribute("cy",String(C)),b.setAttribute("cx",String(c)),b.setAttribute("cy",String(C))}function T(){d.setAcidCutoff(i),d.setAcidResonance(1-l)}let $=!1;function F(c){const C=h.getBoundingClientRect();i=K((c.clientX-C.left)/160,0,1),l=K((c.clientY-C.top)/120,0,1),T(),S(),L()}h.addEventListener("pointerdown",c=>{$=!0,c.target.setPointerCapture(c.pointerId),F(c)}),h.addEventListener("pointermove",c=>{$&&F(c)}),h.addEventListener("pointerup",()=>{$=!1});let G=0;function k(){if(x)return;G+=.05;const c=.3+Math.sin(G)*.15;b.setAttribute("opacity",String(c)),m=requestAnimationFrame(k)}return k(),S(),L(),{element:f,setPosition(c,C){i=c,l=C,S(),L()},update(c){c%4===0&&(b.setAttribute("r","16"),setTimeout(()=>b.setAttribute("r","12"),100))},destroy(){x=!0,cancelAnimationFrame(m)}}}function vt(d){let i=.3,l=.5,m=0,x=!1;const f=20,h=[],y=document.createElement("div");y.style.cssText="position:relative;width:280px;height:180px;cursor:crosshair;flex-shrink:0;";const u=I("svg",{width:280,height:180,viewBox:"0 0 280 180"});u.style.cssText="display:block;border:1px solid rgba(255,16,240,0.2);background:rgba(255,16,240,0.02);",y.appendChild(u);const b=I("defs",{}),g=I("linearGradient",{id:"perf-grad",x1:"0",y1:"1",x2:"1",y2:"0"}),D=I("stop",{offset:"0%","stop-color":"#1a0a2e","stop-opacity":"0.6"}),L=I("stop",{offset:"50%","stop-color":"#0a1a1a","stop-opacity":"0.3"}),S=I("stop",{offset:"100%","stop-color":"#2a1a0a","stop-opacity":"0.6"});g.appendChild(D),g.appendChild(L),g.appendChild(S),b.appendChild(g),u.appendChild(b),u.appendChild(I("rect",{x:0,y:0,width:280,height:180,fill:"url(#perf-grad)"}));for(let p=1;p<6;p++)u.appendChild(I("line",{x1:280/6*p,y1:0,x2:280/6*p,y2:180,stroke:"rgba(255,255,255,0.03)","stroke-width":"1"}));for(let p=1;p<4;p++)u.appendChild(I("line",{x1:0,y1:180/4*p,x2:280,y2:180/4*p,stroke:"rgba(255,255,255,0.03)","stroke-width":"1"}));const T=I("g",{});u.appendChild(T);const $=I("circle",{r:6,fill:s.neonPink,opacity:"0.9"});u.appendChild($);const F=I("circle",{r:14,fill:"none",stroke:s.neonPink,"stroke-width":"1.5",opacity:"0.3"});u.appendChild(F);const G=[{x:4,y:12,text:"bright",anchor:"start"},{x:276,y:12,text:"ACID SCREAMER",anchor:"end"},{x:4,y:176,text:"ambient/deep",anchor:"start"},{x:276,y:176,text:"dark",anchor:"end"}];for(const p of G){const M=I("text",{x:p.x,y:p.y,fill:s.textDim,"font-size":"7","font-family":s.fontMono,"text-anchor":p.anchor,opacity:"0.5"});M.textContent=p.text,u.appendChild(M)}const k=document.createElement("span");k.style.cssText=`position:absolute;top:-14px;left:0;font-size:0.45rem;color:${s.textDim};font-family:${s.fontMono};pointer-events:none;`,k.textContent="PERFORMANCE",y.appendChild(k);function c(){const p=i,M=1-l;d.applyParameterMap({kickLevel:.3+p*.7,acidLevel:.3+p*.7,kickDrive:p*.8,acidResonance:.2+p*.6,acidCutoff:.2+M*.7,synthCutoff:.2+M*.7,synthLevel:.2+M*.5,atmoLevel:.6-p*.4})}function C(){const p=i*280,M=l*180;$.setAttribute("cx",String(p)),$.setAttribute("cy",String(M)),F.setAttribute("cx",String(p)),F.setAttribute("cy",String(M))}function E(){for(;T.firstChild;)T.removeChild(T.firstChild);for(let p=0;p<h.length;p++){const M=p/h.length,Q=I("circle",{cx:h[p].x*280,cy:h[p].y*180,r:2+M*2,fill:s.neonPink,opacity:String(M*.3)});T.appendChild(Q)}}let R=!1;function A(p){const M=u.getBoundingClientRect();i=K((p.clientX-M.left)/280,0,1),l=K((p.clientY-M.top)/180,0,1),h.push({x:i,y:l}),h.length>f&&h.shift(),c(),C(),E()}u.addEventListener("pointerdown",p=>{R=!0,p.target.setPointerCapture(p.pointerId),A(p)}),u.addEventListener("pointermove",p=>{R&&A(p)}),u.addEventListener("pointerup",()=>{R=!1});let B=0,W=0;function Y(){if(!x){if(W++,W%2===0){B+=.08;const p=.3+Math.sin(B)*.15;F.setAttribute("opacity",String(p))}m=requestAnimationFrame(Y)}}return Y(),C(),{element:y,setPosition(p,M){i=p,l=M,h.push({x:i,y:l}),h.length>f&&h.shift(),C(),E()},update(p){p%4===0&&(F.setAttribute("r","18"),setTimeout(()=>F.setAttribute("r","14"),100))},destroy(){x=!0,cancelAnimationFrame(m)}}}function H(d,e){const a=d.findIndex(i=>i.name===e);return a>=0?a:0}function it(d){return{playing:!0,bpm:d.bpm??138,currentStep:0,kick:{muted:!1,level:.8,patternIndex:0,drive:.3,...d.kick},perc:{muted:!1,level:.7,patternIndex:0,tone:.5,...d.perc},acid:{muted:!1,level:.75,patternIndex:0,cutoff:.5,resonance:.6,...d.acid},synth:{muted:!1,level:.5,patternIndex:0,cutoff:.7,release:.4,...d.synth},atmo:{muted:!1,level:.5,patternIndex:0,reverb:.7,...d.atmo}}}let kt=0;function Z(){return`sec-${++kt}`}function Ct(){return[{id:Z(),name:"MURK",bars:4,snapshot:it({kick:{patternIndex:H(z,"HEARTBEAT"),level:.4,drive:.1},perc:{muted:!0},acid:{patternIndex:H(_,"DRIP"),level:.5,cutoff:.2,resonance:.7},synth:{muted:!0},atmo:{patternIndex:H(tt,"VOID"),level:.7,reverb:.9}})},{id:Z(),name:"EMERGE",bars:4,snapshot:it({kick:{patternIndex:H(z,"STUMBLE"),level:.7,drive:.3},perc:{level:.3,tone:.7},acid:{patternIndex:H(_,"CRAWL"),level:.6,cutoff:.4,resonance:.6},synth:{patternIndex:H(J,"FLICKER"),level:.3,cutoff:.5},atmo:{patternIndex:H(tt,"BREATH"),level:.4,reverb:.7}})},{id:Z(),name:"MELT",bars:8,snapshot:it({kick:{patternIndex:H(z,"POUNDING"),level:1,drive:.7},perc:{level:.8,tone:.4},acid:{patternIndex:H(_,"RELENTLESS"),level:.9,cutoff:.8,resonance:.8},synth:{patternIndex:H(J,"RHYTHMIC"),level:.5,cutoff:.9},atmo:{muted:!0}})}]}class Tt{sections=[];currentIndex=-1;currentBar=0;loopMode="loop-all";stepInBar=0;onChangeCallbacks=[];engine;constructor(e){this.engine=e}onChange(e){this.onChangeCallbacks.push(e)}notify(){for(const e of this.onChangeCallbacks)e()}captureSection(e,a){const i={id:Z(),name:e,bars:a,snapshot:this.engine.getSnapshot()};return this.sections.push(i),this.currentIndex<0&&(this.currentIndex=0),this.notify(),i}addSection(e){this.sections.push(e),this.currentIndex<0&&(this.currentIndex=0),this.notify()}removeSection(e){const a=this.sections.findIndex(i=>i.id===e);a<0||(this.sections.splice(a,1),this.currentIndex>=this.sections.length&&(this.currentIndex=Math.max(0,this.sections.length-1)),this.sections.length===0&&(this.currentIndex=-1),this.notify())}moveSection(e,a){if(e<0||e>=this.sections.length)return;a=Math.max(0,Math.min(this.sections.length-1,a));const[i]=this.sections.splice(e,1);this.sections.splice(a,0,i),this.currentIndex===e&&(this.currentIndex=a),this.notify()}jumpToSection(e){e<0||e>=this.sections.length||(this.currentIndex=e,this.currentBar=0,this.stepInBar=0,this.applyCurrentSection(),this.notify())}applyCurrentSection(){const e=this.sections[this.currentIndex];e&&this.engine.applySnapshot(e.snapshot)}onStep(e){if(!(this.sections.length===0||this.currentIndex<0)&&(this.stepInBar++,(e===0||this.stepInBar>=st)&&this.stepInBar>=st)){this.stepInBar=0,this.currentBar++;const a=this.sections[this.currentIndex];a&&this.currentBar>=a.bars&&this.advanceSection()}}advanceSection(){this.currentBar=0,this.stepInBar=0,this.loopMode==="loop-one"?this.applyCurrentSection():this.currentIndex<this.sections.length-1?(this.currentIndex++,this.applyCurrentSection()):this.loopMode==="loop-all"&&(this.currentIndex=0,this.applyCurrentSection()),this.notify()}toggleLoopMode(){const e=["loop-all","loop-one","one-shot"],a=e.indexOf(this.loopMode);this.loopMode=e[(a+1)%e.length],this.notify()}start(){this.sections.length!==0&&(this.currentIndex=0,this.currentBar=0,this.stepInBar=0,this.applyCurrentSection(),this.notify())}get isActive(){return this.sections.length>0&&this.currentIndex>=0}get progress(){const e=this.sections[this.currentIndex];return e?this.currentBar/e.bars:0}}const wt={MURK:"#4466ff",EMERGE:s.neonGreen,MELT:s.neonPink};function At(d){return wt[d]||s.accent}function Et(d,e){const a=document.createElement("div");a.style.cssText=`
    width:100%;max-width:900px;
    border:1px solid rgba(204,255,0,0.1);
    background:rgba(204,255,0,0.02);
    padding:0.5rem 0.8rem;
    display:flex;flex-direction:column;gap:0.4rem;
  `;const i=document.createElement("div");i.style.cssText="display:flex;align-items:center;gap:0.5rem;";const l=document.createElement("button");l.textContent="+SAVE",l.style.cssText=`
    background:none;border:1px solid ${s.neonGreen};color:${s.neonGreen};
    font-family:${s.fontMono};font-size:0.6rem;padding:0.2rem 0.5rem;
    cursor:pointer;white-space:nowrap;
  `,i.appendChild(l);const m=document.createElement("div");m.style.cssText="display:flex;gap:3px;flex:1;min-height:36px;align-items:stretch;",i.appendChild(m);const x=document.createElement("button");x.style.cssText=`
    background:none;border:1px solid ${s.textDim};color:${s.textDim};
    font-family:${s.fontMono};font-size:0.55rem;padding:0.2rem 0.4rem;
    cursor:pointer;white-space:nowrap;
  `,i.appendChild(x),a.appendChild(i);const f=document.createElement("div");f.style.cssText=`display:none;gap:0.5rem;align-items:center;font-size:0.55rem;color:${s.textDim};font-family:${s.fontMono};`,a.appendChild(f);let h=null;function y(){if(m.innerHTML="",d.sections.length===0){const g=document.createElement("div");g.style.cssText=`color:${s.textDim};font-size:0.55rem;font-family:${s.fontMono};padding:0.5rem;`,g.textContent="No sections — click +SAVE to capture current state",m.appendChild(g);return}d.sections.forEach((g,D)=>{const L=document.createElement("div"),S=At(g.name),T=D===d.currentIndex;L.style.cssText=`
        flex:${g.bars};min-width:50px;
        border:1px solid ${T?S:"rgba(255,255,255,0.1)"};
        background:${T?S+"15":"rgba(255,255,255,0.02)"};
        padding:0.2rem 0.4rem;cursor:pointer;position:relative;
        display:flex;flex-direction:column;justify-content:center;
        transition:all 0.15s;
      `;const $=document.createElement("div");$.style.cssText=`font-size:0.55rem;font-family:${s.fontMono};color:${S};white-space:nowrap;overflow:hidden;`,$.textContent=`${g.name}`,L.appendChild($);const F=document.createElement("div");if(F.style.cssText=`font-size:0.45rem;color:${s.textDim};font-family:${s.fontMono};`,F.textContent=`${g.bars} bars`,L.appendChild(F),T){const G=document.createElement("div");G.style.cssText=`
          position:absolute;bottom:0;left:0;height:2px;
          background:${S};transition:width 0.1s;
          box-shadow:0 0 4px ${S};
        `,G.style.width=`${d.progress*100}%`,G.className="section-progress",L.appendChild(G)}L.addEventListener("click",G=>{if(G.shiftKey){u(g);return}d.jumpToSection(D),e?.(),y()}),L.addEventListener("contextmenu",G=>{G.preventDefault(),u(g)}),m.appendChild(L)})}function u(g){h=g.id,f.style.display="flex",f.innerHTML=`
      <span>Edit:</span>
      <input type="text" value="${g.name}" style="
        width:80px;background:rgba(255,255,255,0.05);border:1px solid ${s.textDim};
        color:${s.accent};font-family:${s.fontMono};font-size:0.55rem;padding:2px 4px;
      " data-field="name">
      <span>Bars:</span>
      <input type="number" value="${g.bars}" min="1" max="32" style="
        width:40px;background:rgba(255,255,255,0.05);border:1px solid ${s.textDim};
        color:${s.accent};font-family:${s.fontMono};font-size:0.55rem;padding:2px 4px;text-align:center;
      " data-field="bars">
      <button data-action="update" style="background:none;border:1px solid ${s.neonGreen};color:${s.neonGreen};font-family:${s.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">UPDATE</button>
      <button data-action="delete" style="background:none;border:1px solid ${s.neonPink};color:${s.neonPink};font-family:${s.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">DEL</button>
      <button data-action="close" style="background:none;border:1px solid ${s.textDim};color:${s.textDim};font-family:${s.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">×</button>
    `,f.onclick=D=>{const S=D.target.dataset.action;if(!S||!h)return;const T=d.sections.find($=>$.id===h);if(T){if(S==="update"){const $=f.querySelector('[data-field="name"]'),F=f.querySelector('[data-field="bars"]');T.name=$.value.toUpperCase(),T.bars=Math.max(1,parseInt(F.value)||4);const G=d.engine.getSnapshot();T.snapshot=G,y()}else S==="delete"&&(d.removeSection(h),y());(S==="close"||S==="delete"||S==="update")&&(h=null,f.style.display="none")}}}function b(){const g={"loop-all":"LOOP:ALL","loop-one":"LOOP:ONE","one-shot":"ONE-SHOT"};x.textContent=g[d.loopMode]}return l.addEventListener("click",()=>{const g=`SEC ${d.sections.length+1}`;d.captureSection(g,4),y()}),x.addEventListener("click",()=>{d.toggleLoopMode(),b()}),d.onChange(()=>{y(),e?.()}),y(),b(),{element:a,update(){const g=m.querySelector(".section-progress");g&&(g.style.width=`${d.progress*100}%`)},destroy(){}}}const ct=`
   ╭─────╮
  ╱ ◠   ◠ ╲
 │  ░     ░  │
 │    ω      │
  ╲         ╱
   ╰───┬───╯
    ╱│╲ ╱│╲
   ╱ │ ╳ │ ╲
     │   │
    ╱╲  ╱╲`,St=`
   ╭─────╮
  ╱ ◡   ◡ ╲
 │  ░     ░  │
 │    ▽      │
  ╲         ╱
   ╰───┬───╯
   ╲│╱  ╲│╱
    ╱╲   ╱╲
    │ ╲ ╱ │
   ╱╲  ╳  ╱╲`,lt=`
   ╭─────╮
  ╱ ◉   ◉ ╲
 │  ░     ░  │
 │    ◇      │
  ╲         ╱
   ╰───┬───╯
  ──╱│╲─╱│╲──
   ╱ │ ╳ │ ╲
     │   │
    ╱ ╲ ╱ ╲`,at=`
   ╭─────╮
  ╱ ◠   ◠ ╲
 │  ░     ░  │
 │    ○      │
  ╲         ╱
   ╰───┬───╯
    │╲   ╱│
    │ ╲ ╱ │
    │  ╳  │
   ╱╲   ╱╲`,ht=`
   ╭─────╮
  ╱ ─   ─ ╲
 │  ░     ░  │
 │    ω      │
  ╲    ~    ╱
   ╰───┬───╯
    │   │
    │   │
   ╱╲  ╱╲
  ╱  ╲╱  ╲`,$t={kick:{name:"kick",label:"KICK",color:s.neonPink,patterns:z,knobs:[{label:"DRIVE",param:"kickDrive",initial:.3}]},perc:{name:"perc",label:"PERC",color:s.neonCyan,patterns:z,knobs:[{label:"TONE",param:"percTone",initial:.5}]},acid:{name:"acid",label:"ACID",color:s.neonGreen,patterns:_,knobs:[]},synth:{name:"synth",label:"SYNTH",color:s.neonYellow,patterns:J,knobs:[{label:"CUTOFF",param:"synthCutoff",initial:.7},{label:"DECAY",param:"synthRelease",initial:.4}]},atmo:{name:"atmo",label:"ATMO",color:"#8866ff",patterns:tt,knobs:[{label:"REVERB",param:"atmoReverb",initial:.7}]}},Gt=`
  .acid-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: ${s.bgDeep};
    color: ${s.accent};
    font-family: ${s.fontMono};
    padding: 1rem;
    user-select: none;
    gap: 1rem;
  }

  .acid-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 900px;
    padding: 0.5rem 0;
  }

  .acid-title {
    font-size: 1.3rem;
    color: ${s.neonGreen};
    text-shadow: 0 0 10px ${s.neonGreen};
    white-space: nowrap;
  }

  .acid-back {
    color: ${s.textDim};
    text-decoration: none;
    font-size: 0.8rem;
  }
  .acid-back:hover { color: ${s.accent}; }

  /* Transport */
  .transport {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 900px;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(204, 255, 0, 0.15);
    background: rgba(204, 255, 0, 0.02);
  }

  .play-btn {
    background: none;
    border: 2px solid ${s.neonGreen};
    color: ${s.neonGreen};
    font-family: ${s.fontMono};
    font-size: 1rem;
    padding: 0.4rem 1.2rem;
    cursor: pointer;
    text-shadow: 0 0 6px ${s.neonGreen};
    transition: all 0.15s;
  }
  .play-btn:hover {
    background: rgba(57, 255, 20, 0.1);
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
  }
  .play-btn.playing {
    border-color: ${s.neonPink};
    color: ${s.neonPink};
    text-shadow: 0 0 6px ${s.neonPink};
  }

  .bpm-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${s.textDim};
    font-size: 0.8rem;
  }
  .bpm-control input {
    width: 60px;
    background: rgba(255,255,255,0.05);
    border: 1px solid ${s.textDim};
    color: ${s.accent};
    font-family: ${s.fontMono};
    font-size: 0.9rem;
    text-align: center;
    padding: 0.2rem;
  }

  .step-dots {
    display: flex;
    gap: 3px;
    margin-left: auto;
  }
  .step-dot {
    width: 8px;
    height: 8px;
    background: rgba(204, 255, 0, 0.1);
    transition: background 0.05s;
  }
  .step-dot.active {
    background: ${s.accent};
    box-shadow: 0 0 6px ${s.accentGlow};
  }
  .step-dot.beat {
    background: rgba(204, 255, 0, 0.25);
  }

  /* Channels area */
  .channels-area {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 900px;
    align-items: flex-start;
  }

  .channels {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .channel-strip {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    flex-wrap: wrap;
  }

  .ch-label {
    font-size: 0.7rem;
    font-weight: bold;
    width: 40px;
    text-align: right;
    letter-spacing: 1px;
  }

  .ch-mute {
    width: 24px;
    height: 24px;
    background: none;
    border: 1px solid;
    font-family: ${s.fontMono};
    font-size: 0.65rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
  }
  .ch-mute.muted {
    opacity: 0.3;
  }

  .ch-level {
    width: 80px;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255,255,255,0.1);
    outline: none;
    cursor: pointer;
  }
  .ch-level::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 16px;
    background: currentColor;
    cursor: pointer;
  }

  .ch-patterns {
    display: flex;
    gap: 3px;
    flex-wrap: wrap;
  }
  .ch-pat {
    font-size: 0.55rem;
    padding: 0.2rem 0.4rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: ${s.textDim};
    cursor: pointer;
    font-family: ${s.fontMono};
    transition: all 0.1s;
    white-space: nowrap;
  }
  .ch-pat:hover {
    border-color: rgba(255,255,255,0.3);
  }
  .ch-pat.active {
    border-color: currentColor;
    color: currentColor;
    background: rgba(255,255,255,0.08);
    text-shadow: 0 0 4px currentColor;
  }

  .ch-knobs {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

  .knob-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .knob-label {
    font-size: 0.5rem;
    color: ${s.textDim};
    letter-spacing: 1px;
  }
  .knob-slider {
    width: 60px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255,255,255,0.1);
    outline: none;
    cursor: pointer;
  }
  .knob-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 8px;
    height: 14px;
    background: currentColor;
    cursor: pointer;
  }

  /* Side panel for XY pad */
  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    flex-shrink: 0;
  }

  /* Bottom row: performance pad + lemon chan */
  .bottom-row {
    display: flex;
    gap: 1.5rem;
    width: 100%;
    max-width: 900px;
    align-items: flex-start;
  }

  /* LEMON_CHAN */
  .lemon-chan-container {
    width: 180px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .lemon-chan {
    font-size: 0.6rem;
    line-height: 1.2;
    white-space: pre;
    color: ${s.accent};
    text-shadow: 0 0 4px ${s.accentGlow};
    text-align: center;
    transition: transform 0.1s;
  }

  .lemon-chan.bounce {
    animation: chan-bounce 0.15s ease;
  }

  @keyframes chan-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .chan-mood {
    font-size: 0.55rem;
    color: ${s.textDim};
    text-align: center;
  }

  .chan-energy-bar {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .chan-energy-fill {
    height: 100%;
    background: ${s.neonGreen};
    transition: width 0.3s;
    box-shadow: 0 0 4px ${s.neonGreen};
  }

  /* Responsive */
  @media (max-width: 700px) {
    .channels-area { flex-direction: column; }
    .side-panel { width: 100%; flex-direction: row; justify-content: center; }
    .bottom-row { flex-direction: column; align-items: center; }
    .lemon-chan-container { width: 100%; flex-direction: row; }
    .channels { width: 100%; }
    .step-dots { display: none; }
    .ch-patterns { flex-wrap: wrap; }
  }
`;function Rt(d,e){const a=document.createElement("style");a.textContent=Gt,document.head.appendChild(a);const i=bt(e),l=vt(e),m=new Tt(e);d.innerHTML=`
    <div class="acid-drop">
      <div class="acid-header">
        <a href="#" class="acid-back">&larr; DROPS</a>
        <div class="acid-title">001 &mdash; ACID TEKNO</div>
      </div>

      <div class="transport">
        <button class="play-btn" id="play-btn">PLAY</button>
        <div class="bpm-control">
          <span>BPM</span>
          <input type="number" id="bpm-input" value="${e.state.bpm}" min="80" max="180" step="1">
        </div>
        <div class="step-dots" id="step-dots">
          ${Array.from({length:16},(k,c)=>`<div class="step-dot${c%4===0?" beat":""}" data-step="${c}"></div>`).join("")}
        </div>
      </div>

      <div class="channels-area">
        <div class="channels" id="channels"></div>
        <div class="side-panel" id="side-panel"></div>
      </div>

      <div class="bottom-row" id="bottom-row">
        <div id="perf-pad-mount"></div>
        <div class="lemon-chan-container">
          <pre class="lemon-chan" id="lemon-chan">${ct}</pre>
          <div class="chan-mood" id="chan-mood">( zzZ )</div>
          <div class="chan-energy-bar">
            <div class="chan-energy-fill" id="chan-energy" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <div id="section-timeline-mount"></div>
    </div>
  `,document.getElementById("side-panel").appendChild(i.element),document.getElementById("perf-pad-mount").appendChild(l.element);const h=document.getElementById("section-timeline-mount"),y=Et(m,()=>g());h.appendChild(y.element);const u=document.getElementById("channels"),b=["kick","perc","acid","synth","atmo"];for(const k of b){const c=$t[k],C=e.state[k],E=document.createElement("div");E.className="channel-strip",E.style.color=c.color,E.innerHTML=`
      <span class="ch-label" style="color: ${c.color}">${c.label}</span>
      <button class="ch-mute${C.muted?" muted":""}" data-ch="${k}"
        style="border-color: ${c.color}; color: ${c.color}">M</button>
      <input type="range" class="ch-level" data-ch="${k}" min="0" max="1" step="0.01"
        value="${C.level}" style="color: ${c.color}">
      <div class="ch-patterns" data-ch="${k}">
        ${c.patterns.map((R,A)=>`<button class="ch-pat${A===C.patternIndex?" active":""}"
            data-ch="${k}" data-idx="${A}" style="color: ${c.color}">${R.name}</button>`).join("")}
      </div>
      <div class="ch-knobs">
        ${c.knobs.map(R=>`<div class="knob-group">
            <span class="knob-label">${R.label}</span>
            <input type="range" class="knob-slider" data-param="${R.param}"
              min="0" max="1" step="0.01" value="${R.initial}" style="color: ${c.color}">
          </div>`).join("")}
      </div>
    `,u.appendChild(E)}function g(){for(const E of b){const R=e.state[E],A=u.querySelector(`.ch-level[data-ch="${E}"]`);A&&(A.value=String(R.level));const B=u.querySelector(`.ch-mute[data-ch="${E}"]`);B&&B.classList.toggle("muted",R.muted),u.querySelectorAll(`.ch-pat[data-ch="${E}"]`).forEach((Y,p)=>{Y.classList.toggle("active",p===R.patternIndex)})}const k=u.querySelectorAll(".knob-slider"),c={kickDrive:e.state.kick.drive,percTone:e.state.perc.tone,acidCutoff:e.state.acid.cutoff,acidResonance:e.state.acid.resonance,synthCutoff:e.state.synth.cutoff,synthRelease:e.state.synth.release,atmoReverb:e.state.atmo.reverb};k.forEach(E=>{const R=E.dataset.param;c[R]!==void 0&&(E.value=String(c[R]))});const C=document.getElementById("bpm-input");C&&(C.value=String(e.state.bpm)),i.setPosition(e.state.acid.cutoff,1-e.state.acid.resonance)}const D=document.getElementById("play-btn"),L=document.getElementById("bpm-input"),S=document.querySelectorAll(".step-dot"),T=document.getElementById("lemon-chan"),$=document.getElementById("chan-mood"),F=document.getElementById("chan-energy");D.addEventListener("click",()=>{e.state.playing?(e.stop(),D.textContent="PLAY",D.classList.remove("playing"),S.forEach(k=>k.classList.remove("active"))):(e.start(),D.textContent="STOP",D.classList.add("playing"))}),L.addEventListener("change",()=>{e.setBpm(parseInt(L.value))}),u.addEventListener("click",k=>{const c=k.target;if(c.classList.contains("ch-mute")){const C=c.dataset.ch,E=!e.state[C].muted;e.setMuted(C,E),c.classList.toggle("muted",E)}if(c.classList.contains("ch-pat")){const C=c.dataset.ch,E=parseInt(c.dataset.idx);e.setPattern(C,E),c.parentElement.querySelectorAll(".ch-pat").forEach(A=>A.classList.remove("active")),c.classList.add("active")}}),u.addEventListener("input",k=>{const c=k.target;if(c.classList.contains("ch-level")){const C=c.dataset.ch;e.setChannelLevel(C,parseFloat(c.value))}if(c.classList.contains("knob-slider")){const C=c.dataset.param,E=parseFloat(c.value);({kickDrive:A=>e.setKickDrive(A),percTone:A=>e.setPercTone(A),acidCutoff:A=>e.setAcidCutoff(A),acidResonance:A=>e.setAcidResonance(A),synthCutoff:A=>e.setSynthCutoff(A),synthRelease:A=>e.setSynthRelease(A),atmoReverb:A=>e.setAtmoReverb(A)})[C]?.(E)}});let G=0;e.onStep(k=>{if(S.forEach((c,C)=>{c.classList.toggle("active",C===k)}),i.update(k),l.update(k),m.onStep(k),y.update(),k%4===0&&(G++,T.classList.add("bounce"),setTimeout(()=>T.classList.remove("bounce"),150)),k%4===0){const c=e.getEnergy();F.style.width=`${c.total*100}%`,c.total<.15?(T.textContent=ht,$.textContent="( zzZ )"):c.total<.35?(T.textContent=G%2===0?ct:ht,$.textContent="( . . . )"):c.total<.55?(T.textContent=G%2===0?St:at,$.textContent=c.mid>.4?"( ~ acid ~ )":"( vibing )"):c.total<.8?(T.textContent=G%2===0?at:lt,$.textContent=c.low>.6?"( BOOM )":"( LET'S GO )"):(T.textContent=G%3===0?lt:at,$.textContent="( !!!! )"),c.total>.6?(T.style.color=s.neonPink,T.style.textShadow=`0 0 8px ${s.neonPink}`):c.mid>.3?(T.style.color=s.neonGreen,T.style.textShadow=`0 0 6px ${s.neonGreen}`):(T.style.color=s.accent,T.style.textShadow=`0 0 4px ${s.accentGlow}`)}});for(const k of Ct())m.addSection(k);return{cleanup(){a.remove(),i.destroy(),l.destroy()},syncFromEngine:g,sequencer:m}}const It={id:"001-acid-techno",number:1,title:"ACID TEKNO",genre:"Acid Techno",description:"303-style acid loops with kick sequencer and SVG resonance controls",color:"#39FF14",date:"2026-03-01"};let U=null,ot=null;function Mt(d){U=new gt,U.init(z,_,J,tt),ot=Rt(d,U)}function Lt(){U?.destroy(),ot?.cleanup(),U=null,ot=null}const Ft={meta:It,mount:Mt,destroy:Lt};export{Ft as default};
