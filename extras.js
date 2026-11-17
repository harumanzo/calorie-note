// v1.2 extension: preserves calorie_note_v1 localStorage and legacy JSON backup structure.
(function(){
 const el=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const n=v=>Number(v)||0;
 const rnd=v=>Math.round(v*10)/10;
 const id=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2);
 function recent(){
  const seen=new Set();return [...state.entries].reverse().filter(e=>{let key=[e.name,e.grams,e.unit,e.kcal,e.carbs,e.protein,e.fat].join('|');if(seen.has(key))return false;seen.add(key);return true}).slice(0,80);
 }
 function renderRecent(){
  let q=el('recentSearch').value.trim().toLowerCase();let items=recent().filter(e=>e.name.toLowerCase().includes(q)).slice(0,20);
  el('recentFoods').innerHTML=items.length?items.map((e,i)=>`<div class="item"><div><b>${esc(e.name)}</b><small>${rnd(n(e.grams))}${esc(e.unit||'g')} · ${Math.round(n(e.kcal))}kcal · 탄 ${rnd(n(e.carbs))} / 단 ${rnd(n(e.protein))} / 지 ${rnd(n(e.fat))}g</small></div><button data-readd="${i}">추가</button></div>`).join(''):'<p class="hint">일치하는 이전 기록이 없어요.</p>';
  el('recentFoods')._items=items;
 }
 const baseRender=render;
 render=function(){baseRender();renderRecent()};
 el('recentSearch').addEventListener('input',renderRecent);
 el('recentFoods').addEventListener('click',e=>{let b=e.target.closest('[data-readd]');if(!b)return;let old=el('recentFoods')._items[Number(b.dataset.readd)];if(!old)return;state.entries.push({...old,id:id(),date:el('day').value,meal:el('meal').value});save();render();alert('이전 기록을 다시 추가했어요.')});
 el('quickAdd').addEventListener('click',()=>{
  const name=el('qname').value.trim(),fields=['qkcal','qcarb','qprotein','qfat'];
  if(!name||fields.some(k=>el(k).value.trim()===''))return alert('이름과 칼로리·탄단지를 모두 입력해 주세요.');
  const values=fields.map(k=>Number(el(k).value));if(values.some(v=>!Number.isFinite(v)||v<0))return alert('0 이상의 숫자를 입력해 주세요.');
  let [kcal,carbs,protein,fat]=values;
  state.entries.push({id:id(),date:el('day').value,meal:el('meal').value,name,grams:1,unit:'개',kcal,carbs,protein,fat});
  if(el('qsave').checked)state.foods.push({id:id(),name,kcal,carb:carbs,protein,fat,unit:'개'});
  save();el('qname').value='';fields.forEach(k=>el(k).value='');el('qsave').checked=false;render();alert('간식을 기록했어요.');
 });
 renderRecent();
})();