/* ---------- state ---------- */
function demoState(){
  const log={};
  for(let i=13;i>=1;i--){const d=addDays(TODAY,-i),k=(i*7)%AWRAD.length;
    log[d]={awrad:AWRAD.slice(0,Math.max(2,AWRAD.length-k%4-(i%3))).map(a=>a.id),heart:(i%4)+1,note:''}}
  log[TODAY]={awrad:['salat','sabah'],heart:null,note:''};
  return {demo:true,name:'',log,organs:{
    lisan:{phase:'tathir',days:12,last:addDays(TODAY,-1),resets:2,attempt:3,attemptStart:addDays(TODAY,-12),slips:[
      {date:addDays(TODAY,-30),phase:'tathir',day:7,reason:'انجررت إلى غيبة زميل في مجلس عمل ولم أغيّر الموضوع'},
      {date:addDays(TODAY,-13),phase:'tathir',day:9,reason:'كذبة صغيرة للتهرب من موعد، ظننتها هيّنة'}]},
    ayn:{phase:'tanwir',days:5,last:addDays(TODAY,-1),resets:1,attempt:2,attemptStart:addDays(TODAY,-5),slips:[
      {date:addDays(TODAY,-6),phase:'tanwir',day:4,reason:'سهرت على الهاتف وفاتني ورد التدبر'}]},
    udhun:{phase:'tathir',days:3,last:addDays(TODAY,-1),resets:0,attempt:1,attemptStart:addDays(TODAY,-3),slips:[]},
    qadam:{phase:'done',days:30,last:addDays(TODAY,-15),resets:0,attempt:1,attemptStart:null,slips:[]}}};
}
function blankOrgan(){return{phase:'idle',days:0,last:null,resets:0,attempt:0,attemptStart:null,slips:[]}}
function freshState(name){const o={};ORGANS.forEach(g=>o[g.id]=blankOrgan());return{demo:false,name,log:{},organs:o,marks:emptyMarks()}}
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
if(!S||!S.organs)S=freshState('');
if(S.demo){const lg=S.lang;S=freshState('');if(lg)S.lang=lg}
if(S.onboarded===undefined&&(Object.values(S.organs).some(o=>o.phase!=='idle')||(S.prep&&S.prep.status!=='idle')||(S.marks&&(S.marks.dhikr.length||S.marks.quran.length))))S.onboarded=true;
LANG=S.lang&&LIDX[S.lang]!==undefined?S.lang:'ar';computeHijri();applyLoc();
