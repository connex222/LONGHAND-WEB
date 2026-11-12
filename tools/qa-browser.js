'use strict';
// Standalone test harness: the shipped game remains one offline index.html.
// Usage: node tools/qa-browser.js  (install Playwright and Chromium locally first)
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const checks = [];
  function check(name, ok, detail = '') {
    checks.push({name, pass: !!ok, detail});
    if (!ok) console.error('FAIL', name, detail);
    else console.log('PASS', name);
  }
  check('self-contained HTML', /<html\b/i.test(html) && /<script\s+type="module">/.test(html), 'One-file distribution');
  check('embedded fonts', /<style id="embedded-fonts">/.test(html) && /data:font\/woff2;base64,/.test(html));
  check('saved progress key retained', html.includes('"_lh"'));
  const browser = await chromium.launch({headless: true});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844}, colorScheme:'dark'});
    const blocked = [];
    await context.route(/^https?:\/\//, route => { blocked.push(route.request().url()); return route.abort(); });
    const errors = [];
    const file = pathToFileURL(path.join(root, 'index.html')).href;
    const test = await context.newPage();
    test.on('pageerror', e => errors.push('self-test: '+e.message));
    await test.goto(file+'?test=1', {waitUntil:'load'});
    const panel = test.locator('#testpanel');
    await panel.waitFor({state:'visible',timeout:12000});
    const output = await panel.innerText();
    const totals = output.match(/(\d+) passed,\s*(\d+) failed/);
    check('built-in puzzle self-tests', !!totals && Number(totals[1]) >= 20 && Number(totals[2])===0,
      totals ? totals[0] : output.slice(0,300));
    await test.close();
    const game = await context.newPage();
    game.on('pageerror', e => errors.push('game: '+e.message));
    await game.goto(file,{waitUntil:'load'});
    const title = await game.title();
    check('daily game opens',title==='Longhand',title);
    check('seven-letter puzzle number visible',await game.locator('#t-no').count()===1);
    const dims = await game.evaluate(()=>({content:document.documentElement.scrollWidth,window:innerWidth}));
    check('phone has no horizontal overflow',dims.content<=dims.window+3,JSON.stringify(dims));
    const before = await game.locator('#t-no').innerText();
    await game.reload({waitUntil:'load'});
    check('same-day puzzle stable across reload',before===await game.locator('#t-no').innerText());
    check('no JavaScript errors',errors.length===0,errors.join(' | '));
    check('no remote resources requested',blocked.length===0,blocked.slice(0,5).join(' | '));
    await context.close();
  } finally { await browser.close(); }
  const failed = checks.filter(c=>!c.pass);
  console.log('RESULT:',checks.length-failed.length+'/'+checks.length,'QA checks passed');
  if(failed.length) process.exitCode=1;
})().catch(e=>{console.error('QA ERROR',e.stack||e);process.exitCode=1;});
