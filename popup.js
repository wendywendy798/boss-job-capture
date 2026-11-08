const $ = id => document.getElementById(id);
let job;
function status(s) { $("status").textContent = s; }
chrome.tabs.query({active:true,currentWindow:true}, tabs => {
  const tab=tabs[0];
  if (!tab?.url?.includes("zhipin.com")) { status("请在 BOSS 直聘岗位详情页打开扩展。"); $("form").hidden=true; return; }
  chrome.tabs.sendMessage(tab.id,{type:"COLLECT_JOB"}, data => {
    if (chrome.runtime.lastError || !data) { status("没读到页面内容。请刷新岗位页后再点扩展。"); return; }
    job=data;
    for (const id of ["title","company","location","salary","detail"]) $(id).value=data[id]||"";
    $("url").value=data.url||tab.url||"";
    if (!data.title) status("未自动识别岗位名称，请检查页面是否为岗位详情页，并可手动填写。");
  });
});
$("save").onclick=async()=>{
  const title=$("title").value.trim(); if(!title){status("请填写岗位名称再保存。");return;}
  const item={...job,title,company:$ ("company").value.trim(),location:$ ("location").value.trim(),salary:$ ("salary").value.trim(),url:$ ("url").value.trim(),detail:$ ("detail").value.trim(),capturedAt:new Date().toISOString()};
  if(!item.url){status("没有读取到岗位链接，请确认原始招聘链接后再保存。");return;}
  const {jobs=[]}=await chrome.storage.local.get("jobs");
  if(jobs.some(x=>x.url===item.url)){status("这个岗位链接已采集过。可在“已采集岗位”中查看。");return;}
  const cfg=await chrome.storage.local.get(["notionToken","databaseId"]);
  if(cfg.notionToken&&cfg.databaseId){
    $("save").disabled=true; status("正在写入 Notion…");
    try{
      const rt=v=>v?[{text:{content:String(v).slice(0,1900)}}]:[];
      const props={"岗位名称":{title:rt(item.title)},"公司名称":{rich_text:rt(item.company)},"工作地点":{rich_text:rt(item.location)},"薪资范围":{rich_text:rt(item.salary)},"原始招聘链接":{url:item.url},"核心工作职责":{rich_text:rt(item.detail)},"信息完整度":{select:{name:item.title&&item.company&&item.detail?"部分信息":"信息较少"}},"薪资目标匹配度":{select:{name:"未知"}},"备注":{rich_text:rt("由 BOSS 直聘扩展采集；请核验岗位事实与完整要求。")}};
      if(item.education) props["学历要求"]={rich_text:rt(item.education)};
      if(item.experience) props["工作年限要求"]={rich_text:rt(item.experience)};
      const resp=await fetch("https://api.notion.com/v1/pages",{method:"POST",headers:{"Authorization":`Bearer ${cfg.notionToken}`,"Notion-Version":"2022-06-28","Content-Type":"application/json"},body:JSON.stringify({parent:{database_id:cfg.databaseId},properties:props})});
      const body=await resp.json(); if(!resp.ok) throw new Error(body.message||`HTTP ${resp.status}`);
      item.notionPageId=body.id;
    }catch(e){status(`Notion 写入失败：${e.message}。本次未标记为已保存，请把错误文字发我（不要发 Token）。`); $("save").disabled=false; return;}
    finally{$("save").disabled=false;}
  }
  jobs.unshift(item); await chrome.storage.local.set({jobs});
  status(item.notionPageId?"已写入 Notion，并保留本地备份。":"未配置 Notion；已保存到本地浏览器。");
};
$("openJobs").onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL("jobs.html")});
