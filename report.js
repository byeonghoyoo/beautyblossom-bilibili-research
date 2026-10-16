(function(){
'use strict';
var doc=document, root=doc.documentElement;
var nav=doc.getElementById('tabnav');
var links=[].slice.call(nav.querySelectorAll('a'));
var panels=links.map(function(a){return doc.getElementById(a.getAttribute('href').slice(1));});
root.classList.add('js');
nav.querySelector('.wrap').setAttribute('role','tablist');
links.forEach(function(a,i){
  a.setAttribute('role','tab');a.id='tab-'+panels[i].id;
  a.setAttribute('aria-controls',panels[i].id);
  panels[i].setAttribute('role','tabpanel');panels[i].setAttribute('aria-labelledby',a.id);
  a.addEventListener('click',function(e){e.preventDefault();select(i,true,true);});
  a.addEventListener('keydown',function(e){
    var n=i;
    if(e.key==='ArrowRight')n=(i+1)%links.length;
    else if(e.key==='ArrowLeft')n=(i-1+links.length)%links.length;
    else if(e.key==='Home')n=0;else if(e.key==='End')n=links.length-1;else return;
    e.preventDefault();select(n,true,true);links[n].focus();
  });
});
function select(i,push,scroll){
  links.forEach(function(a,k){var on=k===i;a.setAttribute('aria-selected',on?'true':'false');a.tabIndex=on?0:-1;panels[k].classList.toggle('active',on);});
  if(push&&history.replaceState)history.replaceState(null,'','#'+panels[i].id);
  if(scroll){var top=nav.getBoundingClientRect().top+window.scrollY-0;if(window.scrollY>top)window.scrollTo(0,top);}
}
function fromHash(){var h=location.hash.slice(1);var i=panels.findIndex(function(p){return p.id===h;});select(i<0?0:i,false,false);}
window.addEventListener('hashchange',fromHash);fromHash();
// lightbox
var dlg=doc.getElementById('lightbox');
if(dlg&&typeof dlg.showModal==='function'){
  var img=dlg.querySelector('img'),cap=dlg.querySelector('.cap'),open=dlg.querySelector('.open');
  doc.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a.zoom');if(!a)return;
    if(e.ctrlKey||e.metaKey||e.shiftKey)return;
    e.preventDefault();
    img.src=a.getAttribute('href');img.alt=a.dataset.cap||'';cap.textContent=a.dataset.cap||'';open.href=a.getAttribute('href');
    dlg.showModal();
  });
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});
  dlg.addEventListener('close',function(){img.removeAttribute('src');});
}
// clinic filter
var sel=doc.getElementById('clinicsel');
if(sel){
  sel.disabled=false;
  sel.addEventListener('change',function(){
    var v=sel.value;
    [].forEach.call(doc.querySelectorAll('#vgrid .vcard, #cases .acct'),function(c){c.hidden=!!v&&c.dataset.clinic!==v;});
  });
}
})();