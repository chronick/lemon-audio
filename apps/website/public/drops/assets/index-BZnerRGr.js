import{s as mt,b as ft,r as xt}from"./index-CmJX-qzW.js";let nt=null;function dt(){return nt||(nt=new AudioContext),nt}function yt(){const h=dt();return h.state==="suspended"?h.resume():Promise.resolve()}function j(h){return 440*Math.pow(2,(h-69)/12)}const t={vel:0},o=h=>({vel:h}),r=(h,e=!1,s=!1)=>({note:h,accent:e,slide:s}),n=null,C=33,H=36,V=38,z=40,X=43,W=45,gt=48,B=[57,60,64],it=[62,65,69],rt=[52,55,59],bt=[53,57,60],S=(h,e=.8)=>({notes:h,vel:e}),K=[{name:"FOUR FLOOR",energy:"mid",kick:[o(1),t,t,t,o(1),t,t,t,o(1),t,t,t,o(1),t,t,t],hat:[t,t,o(.6),t,t,t,o(.6),t,t,t,o(.6),t,t,t,o(.6),t],clap:[t,t,t,t,o(.9),t,t,t,t,t,t,t,o(.9),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"DRIVING",energy:"high",kick:[o(1),t,t,t,o(1),t,t,o(.7),o(1),t,t,t,o(1),t,t,t],hat:[o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5),o(.5)],clap:[t,t,t,t,o(1),t,t,t,t,t,t,t,o(1),t,t,o(.5)],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"MINIMAL",energy:"mid",kick:[o(1),t,t,t,t,t,t,t,o(.9),t,t,t,t,t,t,t],hat:[t,t,t,t,t,t,o(.4),t,t,t,t,t,t,t,o(.4),t],clap:[t,t,t,t,o(.7),t,t,t,t,t,t,t,o(.7),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"POUNDING",energy:"high",kick:[o(1),t,t,o(.6),o(1),t,t,t,o(1),t,t,o(.7),o(1),t,t,t],hat:[o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t,o(.6),t],clap:[t,t,t,t,o(1),t,t,o(.4),t,t,t,t,o(1),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,o(.3),t]},{name:"SYNCOPATED",energy:"mid",kick:[o(1),t,t,t,o(.8),t,o(.7),t,o(1),t,t,t,o(.8),t,o(.6),t],hat:[t,t,o(.5),t,t,t,o(.5),t,t,t,o(.5),t,t,t,o(.5),o(.3)],clap:[t,t,t,t,o(.9),t,t,t,t,t,t,o(.5),t,t,o(.8),t],ride:[o(.3),t,t,t,t,t,t,t,o(.3),t,t,t,t,t,t,t]},{name:"HEARTBEAT",energy:"low",kick:[o(.7),t,t,t,t,t,t,t,o(.5),t,t,t,t,t,t,t],hat:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t],clap:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]},{name:"STUMBLE",energy:"low",kick:[o(.8),t,t,t,t,o(.3),t,t,t,t,t,o(.5),t,t,t,t],hat:[t,t,t,t,t,t,t,o(.15),t,t,t,t,t,t,t,t],clap:[t,t,t,t,t,t,t,t,t,t,t,t,o(.3),t,t,t],ride:[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t]}],U=[{name:"CLASSIC",energy:"mid",steps:[r(C,!0),n,r(H),r(z,!1,!0),r(C,!0),n,r(V),n,r(C),r(X,!0,!0),r(z),n,r(C,!0),n,r(H,!1,!0),r(V)]},{name:"HYPNOTIC",energy:"mid",steps:[r(C,!0),r(C),n,r(C),r(C,!0),n,r(H,!1,!0),r(C),r(C,!0),r(C),n,r(C),r(C,!0),n,r(z,!0,!0),r(V,!1,!0)]},{name:"WANDERER",energy:"mid",steps:[r(C,!0),n,r(z,!1,!0),r(X),r(W,!0,!0),n,r(V),n,r(H,!0),n,r(X,!1,!0),r(W,!0),n,r(z),r(V,!1,!0),r(C,!0)]},{name:"STABBY",energy:"high",steps:[r(W,!0),n,n,r(W,!0),n,n,r(z,!0),n,r(W,!0),n,n,r(gt,!0),n,r(W,!0),n,n]},{name:"DEEP",energy:"mid",steps:[r(C),r(C,!1,!0),r(C),n,r(H,!0,!0),r(H),n,r(C),r(C),r(C,!1,!0),n,r(V,!0),r(H,!1,!0),r(C),n,n]},{name:"RELENTLESS",energy:"high",steps:[r(C,!0),r(H),r(C),r(z,!0,!0),r(C),r(V,!0),r(C),r(H,!1,!0),r(C,!0),r(X,!1,!0),r(C),r(z,!0),r(V),r(C,!0),r(H,!1,!0),r(C)]},{name:"DRIP",energy:"low",steps:[r(W,!0),n,n,n,n,n,n,n,n,n,n,n,n,n,r(C,!1,!0),n]},{name:"CRAWL",energy:"low",steps:[r(C),n,r(C,!1,!0),n,n,r(H,!1,!0),n,n,r(V,!1,!0),n,n,n,n,n,r(C,!1,!0),n]}],J=[{name:"OFFBEAT STABS",energy:"mid",steps:[n,n,S(B),n,n,n,S(B,.6),n,n,n,S(B),n,n,n,S(B,.6),n]},{name:"CHORD HITS",energy:"mid",steps:[S(B),n,n,n,S(it,.7),n,n,n,S(B),n,n,n,S(rt,.7),n,n,n]},{name:"ARPEGGIO",energy:"mid",steps:[S([57]),n,S([60]),n,S([64]),n,S([60]),n,S([57]),n,S([60]),n,S([64],.6),n,S([67],.5),n]},{name:"SPARSE PAD",energy:"low",steps:[S(B,.5),n,n,n,n,n,n,n,S(bt,.4),n,n,n,n,n,n,n]},{name:"RHYTHMIC",energy:"high",steps:[S(B,.9),n,S(B,.4),n,n,S(B,.6),n,S(B,.3),S(it,.8),n,S(it,.4),n,n,S(B,.5),n,n]},{name:"FOG",energy:"low",steps:[S(B,.2),n,n,n,n,n,n,n,n,n,n,n,n,n,S(rt,.15),n]},{name:"FLICKER",energy:"low",steps:[n,n,n,S([64],.2),n,n,n,n,n,S([60],.15),n,n,n,n,n,n]}],tt=[{name:"WASH",energy:"mid",type:"wash",filterFreq:2e3,filterQ:1,lfoRate:.1,gain:.15},{name:"DRONE",energy:"mid",type:"drone",filterFreq:400,filterQ:3,lfoRate:.05,gain:.2},{name:"SWEEP",energy:"high",type:"sweep",filterFreq:800,filterQ:5,lfoRate:.3,gain:.12},{name:"RUMBLE",energy:"mid",type:"rumble",filterFreq:150,filterQ:2,lfoRate:.08,gain:.25},{name:"SHIMMER",energy:"mid",type:"shimmer",filterFreq:6e3,filterQ:2,lfoRate:.2,gain:.08},{name:"VOID",energy:"low",type:"drone",filterFreq:120,filterQ:4,lfoRate:.03,gain:.08},{name:"BREATH",energy:"low",type:"wash",filterFreq:600,filterQ:1.5,lfoRate:.18,gain:.05}],vt=138,ot=16;class kt{ctx;masterGain;limiter;kickGain;percGain;acidGain;synthGain;atmoGain;kickDrive;kickComp;percComp;acidFilter;synthFilter;atmoReverb;atmoReverbGain;atmoDryGain;atmoNoise=null;atmoLfo=null;atmoLfoGain=null;atmoNoiseFilter=null;schedulerTimer=null;nextStepTime=0;LOOK_AHEAD=.1;SCHEDULE_INTERVAL=25;kickPatterns=[];acidPatterns=[];synthPatterns=[];atmoPresets=[];state={playing:!1,bpm:vt,currentStep:0,kick:{muted:!1,level:.8,patternIndex:0,drive:.3},perc:{muted:!1,level:.7,patternIndex:0,tone:.5},acid:{muted:!1,level:.75,patternIndex:0,cutoff:.5,resonance:.6},synth:{muted:!1,level:.5,patternIndex:0,cutoff:.7,release:.4},atmo:{muted:!0,level:.5,patternIndex:0,reverb:.7}};stepCallbacks=[];lastAcidFreq=j(33);init(e,s,i,c){this.ctx=dt(),this.kickPatterns=e,this.acidPatterns=s,this.synthPatterns=i,this.atmoPresets=c,this.limiter=this.ctx.createDynamicsCompressor(),this.limiter.threshold.value=-3,this.limiter.knee.value=3,this.limiter.ratio.value=12,this.limiter.attack.value=.001,this.limiter.release.value=.1,this.limiter.connect(this.ctx.destination),this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=.8,this.masterGain.connect(this.limiter),this.buildKickChain(),this.buildPercChain(),this.buildAcidChain(),this.buildSynthChain(),this.buildAtmoChain()}buildKickChain(){this.kickComp=this.ctx.createDynamicsCompressor(),this.kickComp.threshold.value=-15,this.kickComp.ratio.value=4,this.kickComp.attack.value=.003,this.kickComp.release.value=.15,this.kickDrive=this.ctx.createWaveShaper(),this.updateDriveCurve(this.state.kick.drive),this.kickGain=this.ctx.createGain(),this.kickGain.gain.value=this.state.kick.level,this.kickGain.connect(this.kickDrive),this.kickDrive.connect(this.kickComp),this.kickComp.connect(this.masterGain)}buildPercChain(){this.percComp=this.ctx.createDynamicsCompressor(),this.percComp.threshold.value=-18,this.percComp.ratio.value=3,this.percComp.attack.value=.001,this.percComp.release.value=.1,this.percGain=this.ctx.createGain(),this.percGain.gain.value=this.state.perc.level,this.percGain.connect(this.percComp),this.percComp.connect(this.masterGain)}buildAcidChain(){this.acidFilter=this.ctx.createBiquadFilter(),this.acidFilter.type="lowpass",this.acidFilter.frequency.value=this.cutoffToFreq(this.state.acid.cutoff),this.acidFilter.Q.value=this.state.acid.resonance*25,this.acidGain=this.ctx.createGain(),this.acidGain.gain.value=this.state.acid.level,this.acidGain.connect(this.acidFilter),this.acidFilter.connect(this.masterGain)}buildSynthChain(){this.synthFilter=this.ctx.createBiquadFilter(),this.synthFilter.type="lowpass",this.synthFilter.frequency.value=this.cutoffToFreq(this.state.synth.cutoff),this.synthFilter.Q.value=2,this.synthGain=this.ctx.createGain(),this.synthGain.gain.value=this.state.synth.level,this.synthGain.connect(this.synthFilter),this.synthFilter.connect(this.masterGain)}buildAtmoChain(){this.atmoReverb=this.ctx.createConvolver(),this.atmoReverb.buffer=this.generateImpulse(3,4),this.atmoReverbGain=this.ctx.createGain(),this.atmoReverbGain.gain.value=this.state.atmo.reverb,this.atmoDryGain=this.ctx.createGain(),this.atmoDryGain.gain.value=1-this.state.atmo.reverb,this.atmoGain=this.ctx.createGain(),this.atmoGain.gain.value=this.state.atmo.level,this.atmoGain.connect(this.atmoDryGain),this.atmoDryGain.connect(this.masterGain),this.atmoGain.connect(this.atmoReverb),this.atmoReverb.connect(this.atmoReverbGain),this.atmoReverbGain.connect(this.masterGain)}playKick(e,s){const i=this.ctx.createOscillator(),c=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(150,e),i.frequency.exponentialRampToValueAtTime(45,e+.07),c.gain.setValueAtTime(s,e),c.gain.exponentialRampToValueAtTime(.001,e+.4),i.connect(c),c.connect(this.kickGain),i.start(e),i.stop(e+.45)}playHat(e,s,i=!1){const c=this.ctx.sampleRate*(i?.15:.04),m=this.ctx.createBuffer(1,c,this.ctx.sampleRate),x=m.getChannelData(0);for(let v=0;v<c;v++)x[v]=(Math.random()*2-1)*s;const f=this.ctx.createBufferSource();f.buffer=m;const l=this.ctx.createBiquadFilter();l.type="highpass",l.frequency.value=5e3+this.state.perc.tone*7e3;const y=this.ctx.createBiquadFilter();y.type="bandpass",y.frequency.value=8e3+this.state.perc.tone*4e3,y.Q.value=1.5;const u=this.ctx.createGain();u.gain.setValueAtTime(s*.6,e),u.gain.exponentialRampToValueAtTime(.001,e+(i?.15:.04)),f.connect(l),l.connect(y),y.connect(u),u.connect(this.percGain),f.start(e)}playClap(e,s){for(let c=0;c<3;c++){const m=e+c*.01,x=this.ctx.sampleRate*.02,f=this.ctx.createBuffer(1,x,this.ctx.sampleRate),l=f.getChannelData(0);for(let b=0;b<x;b++)l[b]=Math.random()*2-1;const y=this.ctx.createBufferSource();y.buffer=f;const u=this.ctx.createBiquadFilter();u.type="bandpass",u.frequency.value=1200,u.Q.value=2;const v=this.ctx.createGain();v.gain.setValueAtTime(s*.4,m),v.gain.exponentialRampToValueAtTime(.001,m+.08),y.connect(u),u.connect(v),v.connect(this.percGain),y.start(m)}}playRide(e,s){const i=this.ctx.sampleRate*.3,c=this.ctx.createBuffer(1,i,this.ctx.sampleRate),m=c.getChannelData(0);for(let y=0;y<i;y++)m[y]=Math.random()*2-1;const x=this.ctx.createBufferSource();x.buffer=c;const f=this.ctx.createBiquadFilter();f.type="highpass",f.frequency.value=7e3;const l=this.ctx.createGain();l.gain.setValueAtTime(s*.3,e),l.gain.exponentialRampToValueAtTime(.001,e+.3),x.connect(f),f.connect(l),l.connect(this.percGain),x.start(e)}playAcidNote(e,s,i,c){const m=j(s),x=60/this.state.bpm/4,f=this.ctx.createOscillator();f.type="sawtooth",c?(f.frequency.setValueAtTime(this.lastAcidFreq,e),f.frequency.exponentialRampToValueAtTime(m,e+x*.5)):f.frequency.setValueAtTime(m,e);const l=this.ctx.createBiquadFilter();l.type="lowpass";const y=this.cutoffToFreq(this.state.acid.cutoff),u=i?5e3:2500;l.frequency.setValueAtTime(y+u,e),l.frequency.exponentialRampToValueAtTime(Math.max(y,60),e+x*.8),l.Q.value=this.state.acid.resonance*20;const v=this.ctx.createGain(),b=i?.45:.3;v.gain.setValueAtTime(b,e),c?v.gain.setValueAtTime(b,e+x):(v.gain.setValueAtTime(b,e+x*.7),v.gain.exponentialRampToValueAtTime(.001,e+x*.95)),f.connect(l),l.connect(v),v.connect(this.acidGain),f.start(e),f.stop(e+x*1.1),this.lastAcidFreq=m}playSynthChord(e,s,i){const c=60/this.state.bpm/4,m=.05+this.state.synth.release*.4;for(const x of s){const f=j(x),l=this.ctx.createOscillator(),y=this.ctx.createOscillator();l.type="sawtooth",y.type="sawtooth",l.frequency.value=f,y.frequency.value=f*1.005;const u=this.ctx.createGain(),v=i*.12;u.gain.setValueAtTime(.001,e),u.gain.linearRampToValueAtTime(v,e+.005),u.gain.setValueAtTime(v,e+c*.6),u.gain.exponentialRampToValueAtTime(.001,e+c*.6+m),l.connect(u),y.connect(u),u.connect(this.synthGain),l.start(e),y.start(e),l.stop(e+c+m+.1),y.stop(e+c+m+.1)}}startAtmo(){this.stopAtmo();const e=this.atmoPresets[this.state.atmo.patternIndex];if(!e)return;const s=this.ctx.sampleRate*4,i=this.ctx.createBuffer(1,s,this.ctx.sampleRate),c=i.getChannelData(0);if(e.type==="rumble"||e.type==="drone"){let x=0;for(let f=0;f<s;f++){const l=Math.random()*2-1;x=(x+.02*l)/1.02,c[f]=x*3.5}}else for(let x=0;x<s;x++)c[x]=Math.random()*2-1;this.atmoNoise=this.ctx.createBufferSource(),this.atmoNoise.buffer=i,this.atmoNoise.loop=!0,this.atmoNoiseFilter=this.ctx.createBiquadFilter(),this.atmoNoiseFilter.type=e.type==="shimmer"?"highpass":"lowpass",this.atmoNoiseFilter.frequency.value=e.filterFreq,this.atmoNoiseFilter.Q.value=e.filterQ,this.atmoLfo=this.ctx.createOscillator(),this.atmoLfo.type="sine",this.atmoLfo.frequency.value=e.lfoRate,this.atmoLfoGain=this.ctx.createGain(),this.atmoLfoGain.gain.value=e.filterFreq*.5,this.atmoLfo.connect(this.atmoLfoGain),this.atmoLfoGain.connect(this.atmoNoiseFilter.frequency);const m=this.ctx.createGain();m.gain.value=e.gain,this.atmoNoise.connect(this.atmoNoiseFilter),this.atmoNoiseFilter.connect(m),m.connect(this.atmoGain),this.atmoNoise.start(),this.atmoLfo.start()}stopAtmo(){try{this.atmoNoise?.stop()}catch{}try{this.atmoLfo?.stop()}catch{}this.atmoNoise=null,this.atmoLfo=null,this.atmoLfoGain=null,this.atmoNoiseFilter=null}onStep(e){this.stepCallbacks.push(e)}async start(){await yt(),this.state.playing=!0,this.state.currentStep=0,this.nextStepTime=this.ctx.currentTime+.05,this.lastAcidFreq=j(33),this.state.atmo.muted||this.startAtmo(),this.schedule()}stop(){this.state.playing=!1,this.schedulerTimer!==null&&(clearTimeout(this.schedulerTimer),this.schedulerTimer=null),this.stopAtmo()}schedule(){if(!this.state.playing)return;const e=60/this.state.bpm/4;for(;this.nextStepTime<this.ctx.currentTime+this.LOOK_AHEAD;){this.triggerStep(this.state.currentStep,this.nextStepTime);const s=this.state.currentStep,i=this.nextStepTime,c=Math.max(0,(i-this.ctx.currentTime)*1e3);setTimeout(()=>{for(const m of this.stepCallbacks)m(s)},c),this.nextStepTime+=e,this.state.currentStep=(this.state.currentStep+1)%ot}this.schedulerTimer=window.setTimeout(()=>this.schedule(),this.SCHEDULE_INTERVAL)}triggerStep(e,s){if(!this.state.kick.muted){const i=this.kickPatterns[this.state.kick.patternIndex];i&&(i.kick[e]?.vel&&this.playKick(s,i.kick[e].vel),i.hat[e]?.vel&&this.playHat(s,i.hat[e].vel),i.clap[e]?.vel&&this.playClap(s,i.clap[e].vel),i.ride[e]?.vel&&this.playRide(s,i.ride[e].vel))}if(!this.state.acid.muted){const c=this.acidPatterns[this.state.acid.patternIndex]?.steps[e];c&&this.playAcidNote(s,c.note,c.accent,c.slide)}if(!this.state.synth.muted){const c=this.synthPatterns[this.state.synth.patternIndex]?.steps[e];c&&this.playSynthChord(s,c.notes,c.vel)}}setChannelLevel(e,s){this.state[e].level=s,{kick:this.kickGain,perc:this.percGain,acid:this.acidGain,synth:this.synthGain,atmo:this.atmoGain}[e].gain.setTargetAtTime(s,this.ctx.currentTime,.02)}setMuted(e,s){this.state[e].muted=s,e==="atmo"&&(s?this.stopAtmo():this.state.playing&&this.startAtmo())}setKickDrive(e){this.state.kick.drive=e,this.updateDriveCurve(e)}setPercTone(e){this.state.perc.tone=e}setAcidCutoff(e){this.state.acid.cutoff=e,this.acidFilter.frequency.setTargetAtTime(this.cutoffToFreq(e),this.ctx.currentTime,.02)}setAcidResonance(e){this.state.acid.resonance=e,this.acidFilter.Q.setTargetAtTime(e*25,this.ctx.currentTime,.02)}setSynthCutoff(e){this.state.synth.cutoff=e,this.synthFilter.frequency.setTargetAtTime(this.cutoffToFreq(e),this.ctx.currentTime,.02)}setSynthRelease(e){this.state.synth.release=e}setAtmoReverb(e){this.state.atmo.reverb=e,this.atmoReverbGain.gain.setTargetAtTime(e,this.ctx.currentTime,.05),this.atmoDryGain.gain.setTargetAtTime(1-e*.5,this.ctx.currentTime,.05)}setPattern(e,s){this.state[e].patternIndex=s,e==="atmo"&&this.state.playing&&!this.state.atmo.muted&&this.startAtmo()}setBpm(e){this.state.bpm=Math.max(80,Math.min(180,e))}getEnergy(){let e=0,s=0,i=0;return this.state.kick.muted||(e+=this.state.kick.level*.8),this.state.acid.muted||(e+=this.state.acid.level*.4,s+=this.state.acid.level*this.state.acid.cutoff*.6),this.state.perc.muted||(i+=this.state.perc.level*.7),this.state.synth.muted||(s+=this.state.synth.level*.6,i+=this.state.synth.level*this.state.synth.cutoff*.3),this.state.atmo.muted||(s+=this.state.atmo.level*.2),{total:Math.min(1,(e+s+i)/2.5),low:Math.min(1,e),mid:Math.min(1,s),high:Math.min(1,i)}}getSnapshot(){return JSON.parse(JSON.stringify(this.state))}applyParameterMap(e){const s={kickLevel:i=>this.setChannelLevel("kick",i),percLevel:i=>this.setChannelLevel("perc",i),acidLevel:i=>this.setChannelLevel("acid",i),synthLevel:i=>this.setChannelLevel("synth",i),atmoLevel:i=>this.setChannelLevel("atmo",i),kickDrive:i=>this.setKickDrive(i),percTone:i=>this.setPercTone(i),acidCutoff:i=>this.setAcidCutoff(i),acidResonance:i=>this.setAcidResonance(i),synthCutoff:i=>this.setSynthCutoff(i),synthRelease:i=>this.setSynthRelease(i),atmoReverb:i=>this.setAtmoReverb(i)};for(const[i,c]of Object.entries(e))c!==void 0&&s[i]&&s[i](c)}applySnapshot(e){const s=["kick","perc","acid","synth","atmo"];for(const i of s)this.setChannelLevel(i,e[i].level),this.setMuted(i,e[i].muted),this.setPattern(i,e[i].patternIndex);this.setKickDrive(e.kick.drive),this.setPercTone(e.perc.tone),this.setAcidCutoff(e.acid.cutoff),this.setAcidResonance(e.acid.resonance),this.setSynthCutoff(e.synth.cutoff),this.setSynthRelease(e.synth.release),this.setAtmoReverb(e.atmo.reverb),this.setBpm(e.bpm)}cutoffToFreq(e){return 60*Math.pow(200,e)}updateDriveCurve(e){const i=new Float32Array(256),c=e*50;for(let m=0;m<256;m++){const x=m*2/256-1;i[m]=(1+c)*x/(1+c*Math.abs(x))}this.kickDrive.curve=i,this.kickDrive.oversample="4x"}generateImpulse(e,s){const i=this.ctx.sampleRate*e,c=this.ctx.createBuffer(2,i,this.ctx.sampleRate);for(let m=0;m<2;m++){const x=c.getChannelData(m);for(let f=0;f<i;f++)x[f]=(Math.random()*2-1)*Math.pow(1-f/i,s)}return c}destroy(){this.stop(),this.stepCallbacks=[]}}const a={bgDeep:"#0a0a0f",accent:"#CCFF00",accentGlow:"rgba(204, 255, 0, 0.4)",neonYellow:"#FFFF00",neonPink:"#FF10F0",neonCyan:"#00FFFF",neonGreen:"#39FF14",textDim:"#555568",fontMono:"Menlo, Monaco, Consolas, 'Courier New', monospace"};function Q(h,e,s){return Math.max(e,Math.min(s,h))}function M(h,e){const s=document.createElementNS("http://www.w3.org/2000/svg",h);for(const[i,c]of Object.entries(e))s.setAttribute(i,String(c));return s}function Ct(h){let i=h.state.acid.cutoff,c=1-h.state.acid.resonance,m=0,x=!1;const f=document.createElement("div");f.style.cssText="position:relative;width:160px;height:120px;cursor:crosshair;flex-shrink:0;";const l=M("svg",{width:160,height:120,viewBox:"0 0 160 120"});l.style.cssText="display:block;border:1px solid rgba(57,255,20,0.2);background:rgba(57,255,20,0.02);",f.appendChild(l);const y=M("path",{fill:"none",stroke:a.neonGreen,"stroke-width":"1",opacity:"0.4"});l.appendChild(y);for(let k=1;k<4;k++)l.appendChild(M("line",{x1:160/4*k,y1:0,x2:160/4*k,y2:120,stroke:"rgba(255,255,255,0.04)","stroke-width":"1"})),l.appendChild(M("line",{x1:0,y1:120/4*k,x2:160,y2:120/4*k,stroke:"rgba(255,255,255,0.04)","stroke-width":"1"}));const u=M("circle",{r:5,fill:a.neonGreen,opacity:"0.9"});l.appendChild(u);const v=M("circle",{r:12,fill:"none",stroke:a.neonGreen,"stroke-width":"1",opacity:"0.3"});l.appendChild(v);const b=`position:absolute;font-size:0.45rem;color:${a.textDim};font-family:${a.fontMono};pointer-events:none;`,P=document.createElement("span");P.style.cssText=b+"top:2px;left:50%;transform:translateX(-50%);",P.textContent="CUTOFF × RESO",f.appendChild(P);function F(){const k=i,g=1-c,p=[],$=60*Math.pow(200,k),A=g*25;for(let E=0;E<64;E++){const w=E/63*160,d=20*Math.pow(1e3,E/63)/$;let _=1/Math.sqrt(Math.pow(1-d*d,2)+Math.pow(d/Math.max(A,.5),2));A>1&&d>.7&&d<1.4&&(_*=1+(A-1)*.1*Math.exp(-Math.pow((d-1)*5,2)));const pt=20*Math.log10(Math.max(_,.001)),ut=120*.5-pt*(120/60);p.push(`${E===0?"M":"L"}${w.toFixed(1)},${Q(ut,2,118).toFixed(1)}`)}y.setAttribute("d",p.join(" "))}function G(){const k=i*160,g=c*120;u.setAttribute("cx",String(k)),u.setAttribute("cy",String(g)),v.setAttribute("cx",String(k)),v.setAttribute("cy",String(g))}function T(){h.setAcidCutoff(i),h.setAcidResonance(1-c)}let R=!1;function D(k){const g=l.getBoundingClientRect();i=Q((k.clientX-g.left)/160,0,1),c=Q((k.clientY-g.top)/120,0,1),T(),G(),F()}l.addEventListener("pointerdown",k=>{R=!0,k.target.setPointerCapture(k.pointerId),D(k)}),l.addEventListener("pointermove",k=>{R&&D(k)}),l.addEventListener("pointerup",()=>{R=!1});let I=0;function N(){if(x)return;I+=.05;const k=.3+Math.sin(I)*.15;v.setAttribute("opacity",String(k)),m=requestAnimationFrame(N)}return N(),G(),F(),{element:f,setPosition(k,g){i=k,c=g,G(),F()},update(k){k%4===0&&(v.setAttribute("r","16"),setTimeout(()=>v.setAttribute("r","12"),100))},destroy(){x=!0,cancelAnimationFrame(m)}}}function Tt(h){let i=.3,c=.5,m=0,x=!1;const f=20,l=[],y=document.createElement("div");y.style.cssText="position:relative;width:280px;height:180px;cursor:crosshair;flex-shrink:0;";const u=M("svg",{width:280,height:180,viewBox:"0 0 280 180"});u.style.cssText="display:block;border:1px solid rgba(255,16,240,0.2);background:rgba(255,16,240,0.02);",y.appendChild(u);const v=M("defs",{}),b=M("linearGradient",{id:"perf-grad",x1:"0",y1:"1",x2:"1",y2:"0"}),P=M("stop",{offset:"0%","stop-color":"#1a0a2e","stop-opacity":"0.6"}),F=M("stop",{offset:"50%","stop-color":"#0a1a1a","stop-opacity":"0.3"}),G=M("stop",{offset:"100%","stop-color":"#2a1a0a","stop-opacity":"0.6"});b.appendChild(P),b.appendChild(F),b.appendChild(G),v.appendChild(b),u.appendChild(v),u.appendChild(M("rect",{x:0,y:0,width:280,height:180,fill:"url(#perf-grad)"}));for(let d=1;d<6;d++)u.appendChild(M("line",{x1:280/6*d,y1:0,x2:280/6*d,y2:180,stroke:"rgba(255,255,255,0.03)","stroke-width":"1"}));for(let d=1;d<4;d++)u.appendChild(M("line",{x1:0,y1:180/4*d,x2:280,y2:180/4*d,stroke:"rgba(255,255,255,0.03)","stroke-width":"1"}));const T=M("g",{});u.appendChild(T);const R=M("circle",{r:6,fill:a.neonPink,opacity:"0.9"});u.appendChild(R);const D=M("circle",{r:14,fill:"none",stroke:a.neonPink,"stroke-width":"1.5",opacity:"0.3"});u.appendChild(D);const I=[{x:4,y:12,text:"bright",anchor:"start"},{x:276,y:12,text:"ACID SCREAMER",anchor:"end"},{x:4,y:176,text:"ambient/deep",anchor:"start"},{x:276,y:176,text:"dark",anchor:"end"}];for(const d of I){const L=M("text",{x:d.x,y:d.y,fill:a.textDim,"font-size":"7","font-family":a.fontMono,"text-anchor":d.anchor,opacity:"0.5"});L.textContent=d.text,u.appendChild(L)}const N=document.createElement("span");N.style.cssText=`position:absolute;top:-14px;left:0;font-size:0.45rem;color:${a.textDim};font-family:${a.fontMono};pointer-events:none;`,N.textContent="PERFORMANCE",y.appendChild(N);function k(){const d=i,L=1-c;h.applyParameterMap({kickLevel:.3+d*.7,acidLevel:.3+d*.7,kickDrive:d*.8,acidResonance:.2+d*.6,acidCutoff:.2+L*.7,synthCutoff:.2+L*.7,synthLevel:.2+L*.5,atmoLevel:.6-d*.4})}function g(){const d=i*280,L=c*180;R.setAttribute("cx",String(d)),R.setAttribute("cy",String(L)),D.setAttribute("cx",String(d)),D.setAttribute("cy",String(L))}function p(){for(;T.firstChild;)T.removeChild(T.firstChild);for(let d=0;d<l.length;d++){const L=d/l.length,_=M("circle",{cx:l[d].x*280,cy:l[d].y*180,r:2+L*2,fill:a.neonPink,opacity:String(L*.3)});T.appendChild(_)}}let $=!1;function A(d){const L=u.getBoundingClientRect();i=Q((d.clientX-L.left)/280,0,1),c=Q((d.clientY-L.top)/180,0,1),l.push({x:i,y:c}),l.length>f&&l.shift(),k(),g(),p()}u.addEventListener("pointerdown",d=>{$=!0,d.target.setPointerCapture(d.pointerId),A(d)}),u.addEventListener("pointermove",d=>{$&&A(d)}),u.addEventListener("pointerup",()=>{$=!1});let E=0,w=0;function q(){if(!x){if(w++,w%2===0){E+=.08;const d=.3+Math.sin(E)*.15;D.setAttribute("opacity",String(d))}m=requestAnimationFrame(q)}}return q(),g(),{element:y,setPosition(d,L){i=d,c=L,l.push({x:i,y:c}),l.length>f&&l.shift(),g(),p()},update(d){d%4===0&&(D.setAttribute("r","18"),setTimeout(()=>D.setAttribute("r","14"),100))},destroy(){x=!0,cancelAnimationFrame(m)}}}function O(h,e){const s=h.findIndex(i=>i.name===e);return s>=0?s:0}function at(h){return{playing:!0,bpm:h.bpm??138,currentStep:0,kick:{muted:!1,level:.8,patternIndex:0,drive:.3,...h.kick},perc:{muted:!1,level:.7,patternIndex:0,tone:.5,...h.perc},acid:{muted:!1,level:.75,patternIndex:0,cutoff:.5,resonance:.6,...h.acid},synth:{muted:!1,level:.5,patternIndex:0,cutoff:.7,release:.4,...h.synth},atmo:{muted:!1,level:.5,patternIndex:0,reverb:.7,...h.atmo}}}let wt=0;function Z(){return`sec-${++wt}`}function St(){return[{id:Z(),name:"MURK",bars:4,snapshot:at({kick:{patternIndex:O(K,"HEARTBEAT"),level:.4,drive:.1},perc:{muted:!0},acid:{patternIndex:O(U,"DRIP"),level:.5,cutoff:.2,resonance:.7},synth:{muted:!0},atmo:{patternIndex:O(tt,"VOID"),level:.7,reverb:.9}})},{id:Z(),name:"EMERGE",bars:4,snapshot:at({kick:{patternIndex:O(K,"STUMBLE"),level:.7,drive:.3},perc:{level:.3,tone:.7},acid:{patternIndex:O(U,"CRAWL"),level:.6,cutoff:.4,resonance:.6},synth:{patternIndex:O(J,"FLICKER"),level:.3,cutoff:.5},atmo:{patternIndex:O(tt,"BREATH"),level:.4,reverb:.7}})},{id:Z(),name:"MELT",bars:8,snapshot:at({kick:{patternIndex:O(K,"POUNDING"),level:1,drive:.7},perc:{level:.8,tone:.4},acid:{patternIndex:O(U,"RELENTLESS"),level:.9,cutoff:.8,resonance:.8},synth:{patternIndex:O(J,"RHYTHMIC"),level:.5,cutoff:.9},atmo:{muted:!0}})}]}class At{sections=[];currentIndex=-1;currentBar=0;loopMode="loop-all";stepInBar=0;onChangeCallbacks=[];engine;constructor(e){this.engine=e}onChange(e){this.onChangeCallbacks.push(e)}notify(){for(const e of this.onChangeCallbacks)e()}captureSection(e,s){const i={id:Z(),name:e,bars:s,snapshot:this.engine.getSnapshot()};return this.sections.push(i),this.currentIndex<0&&(this.currentIndex=0),this.notify(),i}addSection(e){this.sections.push(e),this.currentIndex<0&&(this.currentIndex=0),this.notify()}removeSection(e){const s=this.sections.findIndex(i=>i.id===e);s<0||(this.sections.splice(s,1),this.currentIndex>=this.sections.length&&(this.currentIndex=Math.max(0,this.sections.length-1)),this.sections.length===0&&(this.currentIndex=-1),this.notify())}moveSection(e,s){if(e<0||e>=this.sections.length)return;s=Math.max(0,Math.min(this.sections.length-1,s));const[i]=this.sections.splice(e,1);this.sections.splice(s,0,i),this.currentIndex===e&&(this.currentIndex=s),this.notify()}jumpToSection(e){e<0||e>=this.sections.length||(this.currentIndex=e,this.currentBar=0,this.stepInBar=0,this.applyCurrentSection(),this.notify())}applyCurrentSection(){const e=this.sections[this.currentIndex];e&&this.engine.applySnapshot(e.snapshot)}onStep(e){if(!(this.sections.length===0||this.currentIndex<0)&&(this.stepInBar++,(e===0||this.stepInBar>=ot)&&this.stepInBar>=ot)){this.stepInBar=0,this.currentBar++;const s=this.sections[this.currentIndex];s&&this.currentBar>=s.bars&&this.advanceSection()}}advanceSection(){this.currentBar=0,this.stepInBar=0,this.loopMode==="loop-one"?this.applyCurrentSection():this.currentIndex<this.sections.length-1?(this.currentIndex++,this.applyCurrentSection()):this.loopMode==="loop-all"&&(this.currentIndex=0,this.applyCurrentSection()),this.notify()}toggleLoopMode(){const e=["loop-all","loop-one","one-shot"],s=e.indexOf(this.loopMode);this.loopMode=e[(s+1)%e.length],this.notify()}start(){this.sections.length!==0&&(this.currentIndex=0,this.currentBar=0,this.stepInBar=0,this.applyCurrentSection(),this.notify())}get isActive(){return this.sections.length>0&&this.currentIndex>=0}get progress(){const e=this.sections[this.currentIndex];return e?this.currentBar/e.bars:0}}const Et={MURK:"#4466ff",EMERGE:a.neonGreen,MELT:a.neonPink};function $t(h){return Et[h]||a.accent}function Gt(h,e){const s=document.createElement("div");s.style.cssText=`
    width:100%;max-width:900px;
    border:1px solid rgba(204,255,0,0.1);
    background:rgba(204,255,0,0.02);
    padding:0.5rem 0.8rem;
    display:flex;flex-direction:column;gap:0.4rem;
  `;const i=document.createElement("div");i.style.cssText="display:flex;align-items:center;gap:0.5rem;";const c=document.createElement("button");c.textContent="+SAVE",c.style.cssText=`
    background:none;border:1px solid ${a.neonGreen};color:${a.neonGreen};
    font-family:${a.fontMono};font-size:0.6rem;padding:0.2rem 0.5rem;
    cursor:pointer;white-space:nowrap;
  `,i.appendChild(c);const m=document.createElement("div");m.style.cssText="display:flex;gap:3px;flex:1;min-height:36px;align-items:stretch;",i.appendChild(m);const x=document.createElement("button");x.style.cssText=`
    background:none;border:1px solid ${a.textDim};color:${a.textDim};
    font-family:${a.fontMono};font-size:0.55rem;padding:0.2rem 0.4rem;
    cursor:pointer;white-space:nowrap;
  `,i.appendChild(x),s.appendChild(i);const f=document.createElement("div");f.style.cssText=`display:none;gap:0.5rem;align-items:center;font-size:0.55rem;color:${a.textDim};font-family:${a.fontMono};`,s.appendChild(f);let l=null;function y(){if(m.innerHTML="",h.sections.length===0){const b=document.createElement("div");b.style.cssText=`color:${a.textDim};font-size:0.55rem;font-family:${a.fontMono};padding:0.5rem;`,b.textContent="No sections — click +SAVE to capture current state",m.appendChild(b);return}h.sections.forEach((b,P)=>{const F=document.createElement("div"),G=$t(b.name),T=P===h.currentIndex;F.style.cssText=`
        flex:${b.bars};min-width:50px;
        border:1px solid ${T?G:"rgba(255,255,255,0.1)"};
        background:${T?G+"15":"rgba(255,255,255,0.02)"};
        padding:0.2rem 0.4rem;cursor:pointer;position:relative;
        display:flex;flex-direction:column;justify-content:center;
        transition:all 0.15s;
      `;const R=document.createElement("div");R.style.cssText=`font-size:0.55rem;font-family:${a.fontMono};color:${G};white-space:nowrap;overflow:hidden;`,R.textContent=`${b.name}`,F.appendChild(R);const D=document.createElement("div");if(D.style.cssText=`font-size:0.45rem;color:${a.textDim};font-family:${a.fontMono};`,D.textContent=`${b.bars} bars`,F.appendChild(D),T){const I=document.createElement("div");I.style.cssText=`
          position:absolute;bottom:0;left:0;height:2px;
          background:${G};transition:width 0.1s;
          box-shadow:0 0 4px ${G};
        `,I.style.width=`${h.progress*100}%`,I.className="section-progress",F.appendChild(I)}F.addEventListener("click",I=>{if(I.shiftKey){u(b);return}h.jumpToSection(P),e?.(),y()}),F.addEventListener("contextmenu",I=>{I.preventDefault(),u(b)}),m.appendChild(F)})}function u(b){l=b.id,f.style.display="flex",f.innerHTML=`
      <span>Edit:</span>
      <input type="text" value="${b.name}" style="
        width:80px;background:rgba(255,255,255,0.05);border:1px solid ${a.textDim};
        color:${a.accent};font-family:${a.fontMono};font-size:0.55rem;padding:2px 4px;
      " data-field="name">
      <span>Bars:</span>
      <input type="number" value="${b.bars}" min="1" max="32" style="
        width:40px;background:rgba(255,255,255,0.05);border:1px solid ${a.textDim};
        color:${a.accent};font-family:${a.fontMono};font-size:0.55rem;padding:2px 4px;text-align:center;
      " data-field="bars">
      <button data-action="update" style="background:none;border:1px solid ${a.neonGreen};color:${a.neonGreen};font-family:${a.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">UPDATE</button>
      <button data-action="delete" style="background:none;border:1px solid ${a.neonPink};color:${a.neonPink};font-family:${a.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">DEL</button>
      <button data-action="close" style="background:none;border:1px solid ${a.textDim};color:${a.textDim};font-family:${a.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">×</button>
    `,f.onclick=P=>{const G=P.target.dataset.action;if(!G||!l)return;const T=h.sections.find(R=>R.id===l);if(T){if(G==="update"){const R=f.querySelector('[data-field="name"]'),D=f.querySelector('[data-field="bars"]');T.name=R.value.toUpperCase(),T.bars=Math.max(1,parseInt(D.value)||4);const I=h.engine.getSnapshot();T.snapshot=I,y()}else G==="delete"&&(h.removeSection(l),y());(G==="close"||G==="delete"||G==="update")&&(l=null,f.style.display="none")}}}function v(){const b={"loop-all":"LOOP:ALL","loop-one":"LOOP:ONE","one-shot":"ONE-SHOT"};x.textContent=b[h.loopMode]}return c.addEventListener("click",()=>{const b=`SEC ${h.sections.length+1}`;h.captureSection(b,4),y()}),x.addEventListener("click",()=>{h.toggleLoopMode(),v()}),h.onChange(()=>{y(),e?.()}),y(),v(),{element:s,update(){const b=m.querySelector(".section-progress");b&&(b.style.width=`${h.progress*100}%`)},destroy(){}}}const ct=`
   ╭─────╮
  ╱ ◠   ◠ ╲
 │  ░     ░  │
 │    ω      │
  ╲         ╱
   ╰───┬───╯
    ╱│╲ ╱│╲
   ╱ │ ╳ │ ╲
     │   │
    ╱╲  ╱╲`,Rt=`
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
    ╱ ╲ ╱ ╲`,st=`
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
  ╱  ╲╱  ╲`,It={kick:{name:"kick",label:"KICK",color:a.neonPink,patterns:K,knobs:[{label:"DRIVE",param:"kickDrive",initial:.3}]},perc:{name:"perc",label:"PERC",color:a.neonCyan,patterns:K,knobs:[{label:"TONE",param:"percTone",initial:.5}]},acid:{name:"acid",label:"ACID",color:a.neonGreen,patterns:U,knobs:[]},synth:{name:"synth",label:"SYNTH",color:a.neonYellow,patterns:J,knobs:[{label:"CUTOFF",param:"synthCutoff",initial:.7},{label:"DECAY",param:"synthRelease",initial:.4}]},atmo:{name:"atmo",label:"ATMO",color:"#8866ff",patterns:tt,knobs:[{label:"REVERB",param:"atmoReverb",initial:.7}]}},Lt=`
  .acid-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: ${a.bgDeep};
    color: ${a.accent};
    font-family: ${a.fontMono};
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
    color: ${a.neonGreen};
    text-shadow: 0 0 10px ${a.neonGreen};
    white-space: nowrap;
  }

  .acid-back {
    color: ${a.textDim};
    text-decoration: none;
    font-size: 0.8rem;
  }
  .acid-back:hover { color: ${a.accent}; }

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
    border: 2px solid ${a.neonGreen};
    color: ${a.neonGreen};
    font-family: ${a.fontMono};
    font-size: 1rem;
    padding: 0.4rem 1.2rem;
    cursor: pointer;
    text-shadow: 0 0 6px ${a.neonGreen};
    transition: all 0.15s;
  }
  .play-btn:hover {
    background: rgba(57, 255, 20, 0.1);
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
  }
  .play-btn.playing {
    border-color: ${a.neonPink};
    color: ${a.neonPink};
    text-shadow: 0 0 6px ${a.neonPink};
  }

  .bpm-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${a.textDim};
    font-size: 0.8rem;
  }
  .bpm-control input {
    width: 60px;
    background: rgba(255,255,255,0.05);
    border: 1px solid ${a.textDim};
    color: ${a.accent};
    font-family: ${a.fontMono};
    font-size: 0.9rem;
    text-align: center;
    padding: 0.2rem;
  }

  .share-btn {
    background: none;
    border: 1px solid ${a.neonCyan};
    color: ${a.neonCyan};
    font-family: ${a.fontMono};
    font-size: 0.7rem;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.15s;
  }
  .share-btn:hover {
    background: rgba(0, 255, 255, 0.08);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.25);
  }
  .share-btn.copied {
    border-color: ${a.neonGreen};
    color: ${a.neonGreen};
    text-shadow: 0 0 6px ${a.neonGreen};
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
    background: ${a.accent};
    box-shadow: 0 0 6px ${a.accentGlow};
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
    font-family: ${a.fontMono};
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
    color: ${a.textDim};
    cursor: pointer;
    font-family: ${a.fontMono};
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
    color: ${a.textDim};
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
    color: ${a.accent};
    text-shadow: 0 0 4px ${a.accentGlow};
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
    color: ${a.textDim};
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
    background: ${a.neonGreen};
    transition: width 0.3s;
    box-shadow: 0 0 4px ${a.neonGreen};
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
`;function Mt(h,e){const s=document.createElement("style");s.textContent=Lt,document.head.appendChild(s);const i=Ct(e),c=Tt(e),m=new At(e);h.innerHTML=`
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
          ${Array.from({length:16},(g,p)=>`<div class="step-dot${p%4===0?" beat":""}" data-step="${p}"></div>`).join("")}
        </div>
        <button type="button" class="share-btn" id="share-btn" title="Copy a URL that replays this preset">SHARE</button>
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
  `,document.getElementById("side-panel").appendChild(i.element),document.getElementById("perf-pad-mount").appendChild(c.element);const l=document.getElementById("section-timeline-mount"),y=Gt(m,()=>b());l.appendChild(y.element);const u=document.getElementById("channels"),v=["kick","perc","acid","synth","atmo"];for(const g of v){const p=It[g],$=e.state[g],A=document.createElement("div");A.className="channel-strip",A.style.color=p.color,A.innerHTML=`
      <span class="ch-label" style="color: ${p.color}">${p.label}</span>
      <button class="ch-mute${$.muted?" muted":""}" data-ch="${g}"
        style="border-color: ${p.color}; color: ${p.color}">M</button>
      <input type="range" class="ch-level" data-ch="${g}" min="0" max="1" step="0.01"
        value="${$.level}" style="color: ${p.color}">
      <div class="ch-patterns" data-ch="${g}">
        ${p.patterns.map((E,w)=>`<button class="ch-pat${w===$.patternIndex?" active":""}"
            data-ch="${g}" data-idx="${w}" style="color: ${p.color}">${E.name}</button>`).join("")}
      </div>
      <div class="ch-knobs">
        ${p.knobs.map(E=>`<div class="knob-group">
            <span class="knob-label">${E.label}</span>
            <input type="range" class="knob-slider" data-param="${E.param}"
              min="0" max="1" step="0.01" value="${E.initial}" style="color: ${p.color}">
          </div>`).join("")}
      </div>
    `,u.appendChild(A)}function b(){for(const A of v){const E=e.state[A],w=u.querySelector(`.ch-level[data-ch="${A}"]`);w&&(w.value=String(E.level));const q=u.querySelector(`.ch-mute[data-ch="${A}"]`);q&&q.classList.toggle("muted",E.muted),u.querySelectorAll(`.ch-pat[data-ch="${A}"]`).forEach((L,_)=>{L.classList.toggle("active",_===E.patternIndex)})}const g=u.querySelectorAll(".knob-slider"),p={kickDrive:e.state.kick.drive,percTone:e.state.perc.tone,acidCutoff:e.state.acid.cutoff,acidResonance:e.state.acid.resonance,synthCutoff:e.state.synth.cutoff,synthRelease:e.state.synth.release,atmoReverb:e.state.atmo.reverb};g.forEach(A=>{const E=A.dataset.param;p[E]!==void 0&&(A.value=String(p[E]))});const $=document.getElementById("bpm-input");$&&($.value=String(e.state.bpm)),i.setPosition(e.state.acid.cutoff,1-e.state.acid.resonance)}const P=document.getElementById("play-btn"),F=document.getElementById("bpm-input"),G=document.querySelectorAll(".step-dot"),T=document.getElementById("lemon-chan"),R=document.getElementById("chan-mood"),D=document.getElementById("chan-energy");P.addEventListener("click",()=>{e.state.playing?(e.stop(),P.textContent="PLAY",P.classList.remove("playing"),G.forEach(g=>g.classList.remove("active"))):(e.start(),P.textContent="STOP",P.classList.add("playing"))}),F.addEventListener("change",()=>{e.setBpm(parseInt(F.value))});const I=document.getElementById("share-btn");let N=null;I.addEventListener("click",async()=>{const g=e.getSnapshot(),{playing:p,currentStep:$,...A}=g,E=mt(window.location.hash)||"001-acid-techno",w=ft(E,A);let q=!1;try{await navigator.clipboard.writeText(w),q=!0}catch{window.prompt("Copy this URL:",w)}q&&(N!==null&&clearTimeout(N),I.classList.add("copied"),I.textContent="COPIED",N=window.setTimeout(()=>{I.classList.remove("copied"),I.textContent="SHARE",N=null},1500))}),u.addEventListener("click",g=>{const p=g.target;if(p.classList.contains("ch-mute")){const $=p.dataset.ch,A=!e.state[$].muted;e.setMuted($,A),p.classList.toggle("muted",A)}if(p.classList.contains("ch-pat")){const $=p.dataset.ch,A=parseInt(p.dataset.idx);e.setPattern($,A),p.parentElement.querySelectorAll(".ch-pat").forEach(w=>w.classList.remove("active")),p.classList.add("active")}}),u.addEventListener("input",g=>{const p=g.target;if(p.classList.contains("ch-level")){const $=p.dataset.ch;e.setChannelLevel($,parseFloat(p.value))}if(p.classList.contains("knob-slider")){const $=p.dataset.param,A=parseFloat(p.value);({kickDrive:w=>e.setKickDrive(w),percTone:w=>e.setPercTone(w),acidCutoff:w=>e.setAcidCutoff(w),acidResonance:w=>e.setAcidResonance(w),synthCutoff:w=>e.setSynthCutoff(w),synthRelease:w=>e.setSynthRelease(w),atmoReverb:w=>e.setAtmoReverb(w)})[$]?.(A)}});let k=0;e.onStep(g=>{if(G.forEach((p,$)=>{p.classList.toggle("active",$===g)}),i.update(g),c.update(g),m.onStep(g),y.update(),g%4===0&&(k++,T.classList.add("bounce"),setTimeout(()=>T.classList.remove("bounce"),150)),g%4===0){const p=e.getEnergy();D.style.width=`${p.total*100}%`,p.total<.15?(T.textContent=ht,R.textContent="( zzZ )"):p.total<.35?(T.textContent=k%2===0?ct:ht,R.textContent="( . . . )"):p.total<.55?(T.textContent=k%2===0?Rt:st,R.textContent=p.mid>.4?"( ~ acid ~ )":"( vibing )"):p.total<.8?(T.textContent=k%2===0?st:lt,R.textContent=p.low>.6?"( BOOM )":"( LET'S GO )"):(T.textContent=k%3===0?lt:st,R.textContent="( !!!! )"),p.total>.6?(T.style.color=a.neonPink,T.style.textShadow=`0 0 8px ${a.neonPink}`):p.mid>.3?(T.style.color=a.neonGreen,T.style.textShadow=`0 0 6px ${a.neonGreen}`):(T.style.color=a.accent,T.style.textShadow=`0 0 4px ${a.accentGlow}`)}});for(const g of St())m.addSection(g);return{cleanup(){s.remove(),i.destroy(),c.destroy()},syncFromEngine:b,sequencer:m}}const Ft={id:"001-acid-techno",number:1,title:"ACID TEKNO",genre:"Acid Techno",description:"303-style acid loops with kick sequencer and SVG resonance controls",color:"#39FF14",date:"2026-03-01"};let Y=null,et=null;function Dt(h){Y=new kt,Y.init(K,U,J,tt);const e=xt();if(e){const s={...Y.state,...e,playing:!1,currentStep:0};Y.applySnapshot(s)}et=Mt(h,Y),e&&et.syncFromEngine()}function Pt(){Y?.destroy(),et?.cleanup(),Y=null,et=null}const Nt={meta:Ft,mount:Dt,destroy:Pt};export{Nt as default};
