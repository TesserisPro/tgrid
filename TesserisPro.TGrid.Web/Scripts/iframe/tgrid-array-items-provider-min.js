var TesserisPro;(function(n){(function(n){var t=function(){function n(n){this.items=n}return n.prototype.getItems=function(n,t,i,r,u,f){var e=[],o;e=e.concat(this.items);this.sort(i);o=this;setTimeout(function(){f(o.onFiltering(r,u).slice(n,n+t),n,t);this.items=[];this.items=this.items.concat(e)},200)},n.prototype.getTotalItemsCount=function(n,t){t(this.onFiltering(n,null).length)},n.prototype.sort=function(n){if(n!=null&&n.length>0&&isNotNull(n[0].path)){var t=this;this.items.sort(function(i,r){return t.sortingRecursive(i,r,n,0)})}},n.prototype.sortingRecursive=function(n,t,i,r){return r!=i.length-1?getMemberValue(n,i[r].path)>getMemberValue(t,i[r].path)?this.sortingOrder(i[r]):getMemberValue(t,i[r].path)>getMemberValue(n,i[r].path)?this.sortingOrderDesc(i[r]):this.sortingRecursive(n,t,i,r+1):getMemberValue(n,i[r].path)>getMemberValue(t,i[r].path)?this.sortingOrder(i[r]):this.sortingOrderDesc(i[r])},n.prototype.sortingOrder=function(n){return n.asc?1:-1},n.prototype.sortingOrderDesc=function(n){return n.asc?-1:1},n.prototype.onFiltering=function(n,t){var e,c,o,u,s,h,r,f,i;if((n==null||n.length==0)&&(t==null||t.length==0))return this.items;for(t==undefined&&(t=[]),e=[],c=0;c<t.length;c++)e.push(!1);for(o=[],u=0;u<this.items.length;u++){for(s=0,i=0;i<n.length;i++)this.filter(this.items[u],n[i])&&s++;for(h=!1,r=-1,i=0;i<t.length;i++)this.filter(this.items[u],t[i])&&(h=!0,r=i,i=t.length);if(s!=0||h){if(s==0&&h&&!e[r]){for(f={},f.isFakeItem=!0,f[t[r].path]=t[r].value,i=0;i<t[r].children.length;i++)f[t[r].children[i].path]=t[r].children[i].value;o.push(f);e[r]=!0}}else o.push(this.items[u])}return o},n.prototype.filter=function(n,t){var r,i;if(!this.isFiltering(n[t.path],t.value,t.condition)){if(t.children.length==0)return!0;for(r=0,i=0;i<t.children.length;i++)this.isFiltering(n[t.children[i].path],t.children[i].value,t.children[i].condition)||r++;if(r==t.children.length)return!0}return!1},n.prototype.isFiltering=function(n,t,i){switch(i){case 1:return n==t;case 2:return n!=t}return!1},n}();n.ArrayItemsProvider=t})(n.TGrid||(n.TGrid={}));var t=n.TGrid})(TesserisPro||(TesserisPro={}))