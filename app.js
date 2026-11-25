// KnowSphere starter: sample local articles + public Wikimedia search APIs.
const articles = [
 {title:"Black hole",category:"Space",summary:"A region of space where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon.",body:"Black holes form when a large amount of matter is compressed into a very small region. Their boundary is called the event horizon. Scientists study them by observing how nearby matter and light behave.",keywords:"space astronomy gravity"},
 {title:"The water cycle",category:"Science",summary:"The continuous movement of water between Earth's surface and the atmosphere through evaporation, condensation and precipitation.",body:"Energy from the Sun causes water to evaporate. Water vapour cools and condenses into clouds, then returns to Earth as rain, snow or other precipitation.",keywords:"science earth nature"},
 {title:"Ancient Egypt",category:"History",summary:"An ancient civilization of northeastern Africa known for its pharaohs, monuments, writing system and long history along the Nile.",body:"The Nile River supported farming, transport and settlements in ancient Egypt. Its history includes the Old, Middle and New Kingdoms, among many other periods.",keywords:"history africa geography"},
 {title:"DNA",category:"Science",summary:"Deoxyribonucleic acid is the molecule that carries hereditary instructions used in the growth, development and functioning of living organisms.",body:"DNA is usually described as a double helix. Its sequence is built from four chemical bases: adenine, thymine, cytosine and guanine.",keywords:"biology science genetics"},
 {title:"Mars",category:"Space",summary:"The fourth planet from the Sun, often called the Red Planet because iron minerals in its soil give its surface a reddish appearance.",body:"Mars has volcanoes, valleys, polar ice and evidence that liquid water flowed on its surface in the distant past. Robotic missions study its geology and climate.",keywords:"space planet astronomy"},
 {title:"Biodiversity",category:"Nature",summary:"The variety of life at genetic, species and ecosystem levels, and the relationships that connect living things.",body:"Biodiversity supports ecosystem processes such as pollination, nutrient cycling and food webs. Habitat loss, pollution and climate change can threaten it.",keywords:"nature biology animals plants"}
];
const $ = id => document.getElementById(id);
const form = $("search-form"), input = $("search-input"), resultsSection = $("results-section");
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function localSearch(q){
 const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
 return articles.filter(a=>terms.some(t=>(a.title+" "+a.category+" "+a.summary+" "+a.keywords).toLowerCase().includes(t)));
}
function articleCard(a){
 return `<article class="article-card"><span class="tag">KnowSphere · ${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(a.title.replaceAll(" ","_"))}" target="_blank" rel="noopener">Explore topic ↗</a></article>`;
}
async function search(q){
 if(!q.trim()) return;
 resultsSection.hidden=false;
 $("results-title").textContent=`Results for “${q}”`;
 $("status").textContent="Searching KnowSphere and Wikipedia…";
 $("results-grid").innerHTML="";
 $("images-grid").innerHTML="";
 $("images-heading").hidden=true;
 resultsSection.scrollIntoView({behavior:"smooth",block:"start"});
 const local=localSearch(q);
 $("results-grid").innerHTML=local.length?local.map(articleCard).join(""):"<div class='empty'>No matching KnowSphere article yet. Explore the external results below.</div>";
 try{
  const url=`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*&srlimit=6`;
  const r=await fetch(url); if(!r.ok) throw new Error("Wikipedia search unavailable");
  const data=await r.json();
  const hits=data.query?.search||[];
  const external=hits.map(x=>`<article class="article-card result-card"><span class="tag">Wikipedia search result</span><h3>${esc(x.title)}</h3><p>${x.snippet.replace(/<[^>]*>/g,"")}</p><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(x.title.replaceAll(" ","_"))}" target="_blank" rel="noopener">Read on Wikipedia ↗</a></article>`).join("");
  $("results-grid").insertAdjacentHTML("beforeend",external);
  $("status").textContent=`Found ${local.length} sample KnowSphere article(s) and ${hits.length} external result(s).`;
 }catch(e){$("status").textContent="KnowSphere search is available, but external search could not load. Check your internet connection and try again.";}
 try{
  const u=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=420&format=json&origin=*`;
  const r=await fetch(u); if(!r.ok) throw new Error();
  const data=await r.json(); const pages=Object.values(data.query?.pages||{});
  const cards=pages.map(p=>{
   const info=p.imageinfo?.[0]; if(!info) return "";
   const title=p.title.replace(/^File:/,"");
   const credit=info.extmetadata?.Artist?.value||"Wikimedia Commons contributor";
   const license=info.extmetadata?.LicenseShortName?.value||"See source page";
   return `<a class="image-card" href="${esc(info.descriptionurl)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(info.thumburl||info.url)}" alt="${esc(title)}"><span>${esc(title)}<br><small>${esc(credit.replace(/<[^>]*>/g,"").slice(0,65))} · ${esc(license)}</small></span></a>`;
  }).join("");
  if(cards){$("images-heading").hidden=false;$("images-grid").innerHTML=cards;}
 }catch(e){/* Image search is optional; the text results remain usable. */}
}
form.addEventListener("submit",e=>{e.preventDefault();search(input.value);});
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.query;search(input.value);}));
$("clear-results").addEventListener("click",()=>{resultsSection.hidden=true;input.value="";});
$("featured-grid").innerHTML=articles.slice(0,3).map(articleCard).join("");
