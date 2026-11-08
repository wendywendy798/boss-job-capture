const token=document.getElementById("token"),db=document.getElementById("db"),status=document.getElementById("status");
chrome.storage.local.get(["notionToken","databaseId"],v=>{token.value=v.notionToken||"";db.value=v.databaseId||"";});
document.getElementById("save").onclick=()=>{const databaseId=db.value.trim().replace(/-/g,"");if(!token.value.trim()||!databaseId){status.textContent=" 请填写 Token 和数据库 ID。";return;}chrome.storage.local.set({notionToken:token.value.trim(),databaseId},()=>status.textContent=" 已保存。")};
