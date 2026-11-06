import fs from 'node:fs';import {spawn} from 'node:child_process';import {once} from 'node:events';
import {chromium} from '/LOCAL_USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const dir=import.meta.dirname;const browser=await chromium.launch({headless:true,executablePath:'/LOCAL_USER/.cache/hyperframes/chrome/chrome-headless-shell/mac_arm-152.0.7977.30/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});await page.goto('file://'+dir+'/index.html');await page.evaluate(()=>document.fonts.ready);
for(const t of [2.8,6.5,8.8,11.5,15.9]){await page.evaluate(t=>window.seek(t),t);await page.screenshot({path:dir+`/检查_${t}s.png`});}
if(process.argv.includes('--preview')){await browser.close();process.exit(0)}
const ff=spawn('/LOCAL_USER/Library/Application Support/bilibili/ffmpeg/ffmpeg',['-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','png','-r','30','-i','pipe:0','-an','-c:v','libx264','-crf','18','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-y',dir+'/Prompt不只是文字_1080P_16秒.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<480;i++){await page.evaluate(t=>window.seek(t),i/30);const b=await page.screenshot({type:'png'});if(!ff.stdin.write(b))await once(ff.stdin,'drain');if(i%60===0)console.log(`frame ${i}/480`)}ff.stdin.end();const [code]=await once(ff,'close');await browser.close();if(code)throw Error(`ffmpeg ${code}`);console.log('render complete');
