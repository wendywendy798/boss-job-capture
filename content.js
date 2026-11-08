function clean(s) { return (s || "").replace(/[\t\u00a0]/g, " ").replace(/\n{3,}/g, "\n\n").trim(); }
function text(sel) { const el = document.querySelector(sel); return el ? clean(el.innerText || el.textContent) : ""; }
function companyName() {
  // Prefer selectors inside the primary job detail/card. A generic .company-name
  // can match recommended jobs elsewhere on the page (and produced false values).
  const selectors = [
    ".job-detail-box .company-info-box .name",
    ".job-detail-box .company-info .name",
    ".job-detail .company-info-box .name",
    ".job-detail .company-info .name",
    ".job-detail-box .company-name",
    ".job-detail .company-name",
    ".company-info-box .company-name",
    ".job-detail-box [class*=company] a",
    ".job-detail [class*=company] a"
  ];
  for (const sel of selectors) {
    for (const el of document.querySelectorAll(sel)) {
      const value = clean(el.innerText || el.textContent);
      if (value && value.length < 60 && !/推荐|相似|热门|美菜/.test(value)) return value;
    }
  }
  // The recruiter line in the main job card often looks like “公司名 · 招聘HR”.
  const main = document.querySelector(".job-detail-box, .job-detail, .job-detail-container");
  if (main) {
    const lines = clean(main.innerText).split("\n").map(x => x.trim()).filter(Boolean);
    const recruiter = lines.find(x => /招聘hr|招聘 HR|招聘者|hr$/i.test(x));
    if (recruiter) return recruiter.split(/[·•|]/)[0].trim();
  }
  return "";
}
function collect() {
  const title = text(".job-name") || text(".job-title") || document.querySelector("h1")?.innerText?.trim() || "";
  const company = companyName();
  const salary = text(".salary") || text(".job-salary") || "";
  const location = text(".job-area") || text(".location-address") || text(".job-location") || "";
  const detail = text(".job-sec-text") || text(".job-description") || text(".job-detail") || "";
  const visible = clean(document.body.innerText).slice(0, 12000);
  const lines = visible.split("\n").map(x => x.trim()).filter(Boolean);
  const pick = re => lines.find(x => re.test(x)) || "";
  const education = pick(/学历|本科|大专|硕士|博士|不限/);
  const experience = pick(/经验|年限|年以上|年以下/);
  return { title, company, salary, location, detail, url: window.location.href, education, experience, pageText: visible, capturedAt: new Date().toISOString() };
}
chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg?.type === "COLLECT_JOB") { respond(collect()); }
});
