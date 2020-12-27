(()=>{"use strict";const e=React,t=ReactDOM,l=e=>{switch(e){case"WHITE":return"BLACK";case"BLACK":return"WHITE";default:throw e}},n=(e,t)=>{const[l,n]=e;return l*t+n},r=(e,t)=>{const[l,n]=e;return 0<=l&&l<t&&0<=n&&n<t},s=(e,t)=>{const[l,n]=e,[r,s]=t;return[l+r,n+s]},a={middles:[],ends:[]},i=(e,t,l,a)=>{const i=(i,c)=>{let u=((e,t)=>[Math.floor(e/t+1e-6),e%t])(t,a);for(;;){if(u=s(u,i),!r(u,a))return null;const t=n(u,a),o=e[t];if(null==o)return null;if(o===l)return 0==c.length?null:{middles:c,ends:[t]};c.push(n(u,a))}};if(null!=e[t])return null;const c=[1,1,0,-1,-1,-1,0,1],u=[0,1,1,1,0,-1,-1,-1],o=[],d=[];for(let e=0;e<8;e++){const t=i([u[e],c[e]],[]);null!=t&&(o.push(...t.middles),d.push(...t.ends))}return 0===o.length?null:{middles:o,ends:d}},c=t=>{const{state:l,hoveredCell:n,hover:r,put:s}=t,{active:a,cells:i,prediction:c}=l,o=e.useCallback((()=>{r(null)}),[r]),d=e.useMemo((()=>{var e,t;return null!=n&&null!=c[n]?[...null===(e=c[n])||void 0===e?void 0:e.middles,...null===(t=c[n])||void 0===t?void 0:t.ends]:[]}),[n,c]);return e.createElement("article",{className:"board",onMouseLeave:o},i.map(((t,l)=>{var i,o;const m=0!==(null!==(o=null===(i=c[l])||void 0===i?void 0:i.middles.length)&&void 0!==o?o:0),v=d.includes(l);return m&&l===n&&(t=a),e.createElement(u,{key:l,id:l,color:t,isCandidate:m,isPredictionTarget:v,hover:r,put:s})})))},u=t=>{const{id:l,color:n,isCandidate:r,isPredictionTarget:s,hover:a,put:i}=t,c=e.useCallback((()=>{i(l)}),[l,i]),u=e.useCallback((()=>{a(l)}),[l,a]);return e.createElement("div",{key:l,className:"cell",onClick:c,onMouseEnter:u,"data-is-candidate":r,"data-is-prediction-target":s},e.createElement("div",{className:"stone","data-color":n}))},o=()=>{const e=[];for(let t=0;t<3;t++)for(let t=0;t<3;t++)e.push(null);return e},d=()=>{const[t,l]=e.useState("BLACK"),[n,r]=e.useState(o),s=e.useCallback(((e,t)=>{null==n[e]&&r((l=>l.map(((l,n)=>n==e?t:l))))}),[]),a=e.useMemo((()=>(e=>{const t=t=>{const[l,n]=t;return e[3*l+n]},l=e=>{const[l,n,r]=e,s=t(l);return null!=s&&[n,r].every((e=>t(e)===s))?s:null},n=(e,t)=>{for(let l=0;l<e.length;l++){const n=t(e[l]);if(null!=n)return n}return null},r=[0,1,2];return n(r,(e=>l(r.map((t=>[e,t])))))||n(r,(e=>l(r.map((t=>[t,e])))))||l(r.map((e=>[e,e])))||l(r.map((e=>[e,2-e])))})(n)),[n]);return e.createElement("article",{className:"g-concurrent-reversi g-concurrent-reversi-container"},e.createElement("div",{className:"grid"},n.map(((n,r)=>null==n?e.createElement(m,{id:r,active:t,readonly:null!=a,setActive:l,setDivision:s}):e.createElement("div",{className:"division"},e.createElement("div",{className:"division-stone","data-color":n}))))),null==a?e.createElement("div",null,"手番: ",t):e.createElement("div",{style:{fontWeight:"bold"}},"勝者: ",a))},m=t=>{const{id:r,active:s,readonly:u,setActive:o,setDivision:d}=t,[m,v]=e.useState((()=>(e=>{const t=[];for(let e=0;e<6;e++)for(let e=0;e<6;e++)t.push(null);const l=[[n([2,2],6),"BLACK"],[n([2,3],6),"WHITE"],[n([3,2],6),"WHITE"],[n([3,3],6),"BLACK"]];for(const[e,n]of l)t[e]=n;return t})())),p=e.useMemo((()=>{let e=(e=>{const{dim:t,active:l,cells:n}=e,r=n.filter((e=>"BLACK"===e)).length,s=n.filter((e=>"WHITE"===e)).length,c=((e,t,l)=>0==e?"WHITE":0===t?"BLACK":e+t===l*l?e>t?"BLACK":"WHITE":null)(r,s,t),u=null==c?n.map(((e,r)=>{var s;return null!==(s=i(n,r,l,t))&&void 0!==s?s:a})):n.map((()=>a)),o=null==c&&u.every((e=>0===e.middles.length&&0===e.ends.length));return Object.assign(Object.assign({},e),{blackCount:r,whiteCount:s,prediction:u,passOnly:o,winner:c})})({dim:6,active:s,cells:m});return u&&(e=(e=>Object.assign(Object.assign({},e),{passOnly:!1,prediction:e.cells.map((()=>a))}))(e)),e}),[s,u,m]),[E,h]=e.useState(null),C=e.useCallback((e=>{h(e)}),[]),f=e.useCallback((e=>{const t=((e,t,n,r)=>{if(null!=e[t])return null;const s=i(e,t,n,6);return null==s?null:{updateActive:l,updateCells:e=>e.map(((e,l)=>l===t||s.middles.includes(l)?n:e))}})(m,e,s);null!=t&&(o(t.updateActive),v(t.updateCells))}),[s,m]);return e.useEffect((()=>{null!=p.winner&&d(r,p.winner)}),[p.winner]),e.createElement("article",{className:"g-reversi g-reversi-container"},e.createElement(c,{hoveredCell:E,state:p,hover:C,put:f}))},v=()=>e.createElement("main",{id:"main"},e.createElement("h1",null,"Concurrent Reversi"),e.createElement(d,null));(()=>{const l=document.getElementById("app-container");t.render(e.createElement(v,null),l)})()})();