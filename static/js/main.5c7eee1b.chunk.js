(this["webpackJsonptoken-crack"]=this["webpackJsonptoken-crack"]||[]).push([[0],{16:function(e,t,n){e.exports=n(28)},21:function(e,t,n){},27:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(10),u=n.n(c),l=n(11),i=n(12),o=n(15),s=n(14),m=(n(21),n(2)),f=n.n(m);function v(e){try{return e?r.a.createElement("div",{key:"base64-result"},r.a.createElement("aside",null,"Base64"),r.a.createElement("span",null,atob(e))):null}catch(t){return null}}var d=n(3),p=n.n(d),b=n(1),E=n(5),j=n(4),O=n.n(j),y=n(8),h=n.n(y);function k(e){var t=e.split(".");return 3!==t.length?null:{header:JSON.parse(atob(t[0])),payload:JSON.parse(atob(t[1])),signature:t[2]}}function g(e){for(var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4,a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=O.a.UZERO,c=0,u=0;n;)t=e[u++],r=r.add(O.a.fromInt(255&t).shiftLeft(c)),c+=8,n--;return a&&128&t&&(r=r.toSigned()),[e.slice(u),r]}function S(e,t){var n=Object(E.a)(e.slice(0,t));return[e.slice(t),n]}function N(e){var t,n=function(e){for(var t=0,n=0,a=0;;){var r=e[a++];if(t+=(127&r)*Math.pow(2,n),0===(128&r))break;n+=7}return[e.slice(a),t]}(e),a=Object(b.a)(n,2);e=a[0],t=a[1];var r=String.fromCharCode.apply(String,Object(E.a)(e.slice(0,t)));return[e.slice(t),h.a.decode(r)]}function D(e){var t,n=g(e),a=Object(b.a)(n,2),r=S(e=a[0],a[1]),c=Object(b.a)(r,2);return e=c[0],(t=c[1]).string=function(){return h.a.decode(String.fromCharCode.apply(String,Object(E.a)(t)))},[e,t]}function w(e){try{var t=k(e);return t&&r.a.createElement("div",{key:"JWT-result"},r.a.createElement("aside",null,"JWT"),r.a.createElement("table",null,r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",null,"header"),r.a.createElement("td",null,r.a.createElement(p.a,{json:t.header}))),r.a.createElement("tr",null,r.a.createElement("td",null,"payload"),r.a.createElement("td",null,r.a.createElement(p.a,{json:t.payload}),"}")),r.a.createElement("tr",null,r.a.createElement("td",null,"signature"),r.a.createElement("td",null,t.signature)))))}catch(n){return null}}var I=[[1,"refresh"],[2,"uic"],[4,"identity"],[8,"identity_update"],[16,"contacts"],[32,"contacts_update"],[64,"reauth"],[128,"commerce"],[256,"communication"],[512,"communication_ro"],[956,"client"]];function T(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new Date(1e3*e),a=t?function(e){return f.a.lte(e,Date.now())}:function(e){return f.a.gt(e,Date.now())};return a(n.valueOf())?r.a.createElement("span",{className:"date_future"},n.toISOString()):r.a.createElement("span",null,n.toISOString())}function C(e){try{var t=k(e=e.replace(/^(Authentication:\s*)?skypetoken=/i,"").trim());return t&&f.a.every(f.a.at(t,"header.kid","payload.skypeid","payload.scp"),Boolean)?r.a.createElement("div",{key:"SkypeToken-result"},r.a.createElement("aside",null,"SkypeToken"),r.a.createElement("table",null,r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",null,"Key ID"),r.a.createElement("td",null,t.header.kid)),r.a.createElement("tr",null,r.a.createElement("td",null,"Issued time"),r.a.createElement("td",null,T(t.payload.iat))),r.a.createElement("tr",null,r.a.createElement("td",null,"Expires"),r.a.createElement("td",null,T(t.payload.exp))),r.a.createElement("tr",null,r.a.createElement("td",null,"Serial"),r.a.createElement("td",null,t.payload.csi)),r.a.createElement("tr",null,r.a.createElement("td",null,"Scopes"),r.a.createElement("td",null,"".concat((n=t.payload.scp,a=I,f.a.join(f.a.compact(a.map((function(e){var t=Object(b.a)(e,2),a=t[0],r=t[1];return(n&a)===a?r:null}))),", "))," (").concat(t.payload.scp,")"))),r.a.createElement("tr",null,r.a.createElement("td",null,"SkypeID"),r.a.createElement("td",null,t.payload.skypeid)),r.a.createElement("tr",null,r.a.createElement("td",null,"Tenat"),r.a.createElement("td",null,t.payload.tid)),r.a.createElement("tr",null,r.a.createElement("td",null,"Region"),r.a.createElement("td",null,t.payload.rgn))))):null}catch(c){return null}var n,a}var A=n(13),x=n.n(A);function J(e){var t;t=e;for(var n=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),a=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),r=function(){var e=g(t,1),n=Object(b.a)(e,2);return t=n[0],n[1]}(),c=function(){var e;if(0!==r){var n=function(e){var t,n={};return t=e,n.as=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.bd=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.bdp=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.cid=function(){var e=g(t,8),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.country=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.dfu=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.fname=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.fla=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.gen=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.isid=function(){var e=g(t,4,!1),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.lp=function(){var e=g(t,2),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.lri=function(){var e=g(t,8),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.mname=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.pcode=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.puidh=function(){var e=g(t,4,!0),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.puidl=function(){var e=g(t,4,!0),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.rep=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),n.wal=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),[t,n]}(t),a=Object(b.a)(n,2);t=a[0],e=a[1]}return e}(),u=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),l=[],i=function(){var e=g(t,8),n=Object(b.a)(e,2);return t=n[0],n[1]},o=0;o<u;o++){var s=i();l.push(s)}for(var m=function(){var e=g(t,1),n=Object(b.a)(e,2);return t=n[0],n[1]}(),v=function(){var e=g(t,1),n=Object(b.a)(e,2);return t=n[0],n[1]}(),d=function(){var e;if(0!==v){var n=N(t),a=Object(b.a)(n,2);t=a[0],e=a[1]}return e}(),p=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),E=function(){var e=g(t,1),n=Object(b.a)(e,2);return t=n[0],n[1]}(),j=function(){var e;if(0!==E){var n=S(t,16),a=Object(b.a)(n,2);t=a[0],e=a[1]}return e}(),y=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),h=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),k=[],D=function(){var e=N(t),n=Object(b.a)(e,2);return t=n[0],n[1]},w=0;w<h;w++){var I=D();k.push(I)}return f.a.cloneDeepWith({authType:n,name:a,hasPp:r,pp:c,numIds:u,identifiers:l,isrea:m,hassky:v,skyid:d,uictsn:p,hastid:E,tid:j,csid:y,numScp:h,scp:k},(function(e){return O.a.isLong(e)?e.toString():void 0}))}function R(e){try{if(!(e=e.replace(/^((Set-)?RegistrationToken:\s*)?registrationToken=/i,"").trim().split(";")[0]))return;var t=atob(e),n=f.a.compact(t.split(";")).map((function(e){var t=e.split(":"),n=Object(b.a)(t,4);return{key:n[0],value:n[3]}})).map((function(e){var t=e.key,n=e.value;return"User.AthCtxt"===t?{key:t,value:J(x.a.toByteArray(n))}:{key:t,value:n}}));if(1===n.length)return;return r.a.createElement("div",{key:"RegToken-result"},r.a.createElement("aside",null,"RegToken"),r.a.createElement("table",null,r.a.createElement("tbody",null,n.map((function(e){return r.a.createElement("tr",{key:e.key},r.a.createElement("td",null,e.key),r.a.createElement("td",null,f.a.isObject(e.value)?r.a.createElement(p.a,{json:e.value}):e.value))})))))}catch(a){return null}}function B(e){try{if(!(e=(e.match(/[0-9a-fA-F]{4,}/)||[])[0])||e.length%2)return null;var t,n=f.a.chunk(e,2).map((function(e){return e.join("")})).map((function(e){return Number.parseInt(e,16)}));t=n;var a=function(){var e=g(t,1),n=Object(b.a)(e,2);return t=n[0],n[1]}(),c=function(){var e,n=g(t,8),a=Object(b.a)(n,2);return t=a[0],e=a[1],new Date(e.toNumber())}(),u=function(){var e=D(t),n=Object(b.a)(e,2);return t=n[0],n[1].string()}(),l=function(){var e=g(t),n=Object(b.a)(e,2);return t=n[0],n[1]}(),i=function(){var e=g(t,8),n=Object(b.a)(e,2);return t=n[0],n[1]}(),o=function(){var e=D(t),n=Object(b.a)(e,2);return t=n[0],n[1].string()}(),s=function(){var e=g(t,8),n=Object(b.a)(e,2);return t=n[0],n[1]}(),m=f.a.range(a>=25?5:4).map((function(){var e=function(){var e=g(t,1),n=Object(b.a)(e,2);return t=n[0],n[1]}();return f.a.range(e).map((function(){return{start:function(){var e,n=g(t,8),a=Object(b.a)(n,2);return t=a[0],e=a[1],new Date(e.toNumber())}(),end:function(){var e,n=g(t,8),a=Object(b.a)(n,2);return t=a[0],e=a[1],new Date(e.toNumber())}()}}))}));if(!o||[c].concat(Object(E.a)(f.a.flatten(f.a.flatten(m).map((function(e){return[e.start,e.end]}))))).some((function(e){return isNaN(e.getTime())})))return null;var v=function(){var e=g(t,8),n=Object(b.a)(e,2);return t=n[0],n[1]}(),d=v>0&&function(){var e=D(t),n=Object(b.a)(e,2);return t=n[0],n[1].string()}(),j=a>=25&&function(){var e=D(t),n=Object(b.a)(e,2);return t=n[0],n[1].string()}(),y=f.a.cloneDeepWith({i$ver:a,sta:c,ntwrk:u,c$flt:l,cid:i,skypeId:o,ver:s,dSeg:m,lcVer:v,lcID:d,thID:j},(function(e){return O.a.isLong(e)?e.toString():void 0}));return r.a.createElement("div",{key:"SyncState-result"},r.a.createElement("aside",null,"SyncState"),r.a.createElement("div",null,r.a.createElement(p.a,{json:y})))}catch(h){return null}}var W=function(e){Object(o.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={token:""},a}return Object(i.a)(n,[{key:"render",value:function(){var e=this,t={};return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"App-header"},r.a.createElement("h2",null,"Crack a token!")),r.a.createElement("main",{className:"App-intro"},r.a.createElement("textarea",{ref:function(e){return e?t.input=e:t.input&&function(e){e.style.minHeight="auto",e.style.minHeight=Math.max(e.scrollHeight,70)+"px"}(t.input)},className:"the-token",placeholder:"Enter the encoded mambo jumbo",onChange:function(t){return e.handleChange(t)},value:this.state.token,autoFocus:!0}),r.a.createElement("div",{className:"the-result"},this.state.result||"")))}},{key:"handleChange",value:function(e){var t=(e.target.value||"").trim(),n={token:t,result:null},a=function(e){var t=f.a.over(C,w,R,B,v);return f.a.compact(t(e))}(t);f.a.isArray(a)&&(a=f.a.first(a)),n.result=a||function(e){return e?r.a.createElement("div",{key:"default-result"},r.a.createElement("span",null,"Don't know")):""}(t),this.setState(n)}}]),n}(a.Component);n(27);u.a.render(r.a.createElement(W,null),document.getElementById("root"))}},[[16,1,2]]]);
//# sourceMappingURL=main.5c7eee1b.chunk.js.map