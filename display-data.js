import {GLYPHS} from './glyphs.js?v=12';
import {LAYOUT} from './layout.js?v=12';
export const MAX_COLUMNS=LAYOUT.station.columns;
export const columns=text=>[...String(text??'')].reduce((n,c)=>n+(GLYPHS[c]||GLYPHS['?'])[0].length+1,0);
export const transferItems=value=>(Array.isArray(value)?value:String(value??'').split(/[\s.·•]+/)).map(v=>String(v).trim()).filter(Boolean);
export const transferText=value=>transferItems(value).join('.');
export const stationText=s=>s.name+(s.marker?' '+s.marker:'')+(s.accessible?' @':'');
export function fitText(value,budget=MAX_COLUMNS){let out='';for(const c of String(value??'')){if(columns(out+c)>budget)break;out+=c;}return out;}
export function normalizeStation(s,{strict=false}={}){const ascii=v=>String(v??'').replace(/[^\x20-\x7e]/g,'');const marker=ascii(s.marker).replace(/[^a-z0-9]/gi,'');const out={...s,name:ascii(s.name),marker:marker?'<'+marker+'>':'',transfers:transferItems(s.transfers).map(ascii).filter(Boolean).join(' ')};if(strict&&(columns(stationText(out))>MAX_COLUMNS||columns(transferText(out.transfers))>MAX_COLUMNS))throw Error('站名或换乘超出 120 列点阵宽度：'+out.name);out.marker=fitText(out.marker,MAX_COLUMNS-(out.accessible?columns(' @'):0)-columns(out.name+' '));out.name=fitText(out.name,MAX_COLUMNS-columns((out.marker?' '+out.marker:'')+(out.accessible?' @':'')));const tokens=[];for(const t of transferItems(out.transfers)){if(columns(transferText([...tokens,t]))>MAX_COLUMNS)break;tokens.push(t);}out.transfers=tokens.join(' ');return out;}
