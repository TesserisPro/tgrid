//!=====================================================================================
//!
//! The Tesseris Free License
//!
//! Copyright(c) 2014 Tesseris Pro LLC
//!
//! Permission is hereby granted, free of charge, to any person obtaining a copy of this 
//! software and associated documentation files(the "Software"), to deal in the Software 
//! without restriction, including without limitation the rights to use, copy, modify,
//! merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
//! permit persons to whom the Software is furnished to do so, subject to the following
//! conditions:
//!
//! 1. The above copyright notice and this permission notice shall be included in all 
//!    copies or substantial portions of the Software.
//!
//! 2. Any software that fully or partially contains or uses materials covered by 
//!    this license shall notify users about this notice and above copyright.The 
//!    notification can be made in "About box" and / or site main web - page footer.The 
//!    notification shall contain name of Tesseris Pro company and name of the Software 
//!    covered by current license.
//!
//! THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
//! INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//! PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
//! HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
//! OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//! SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//!
//!=====================================================================================
var TesserisPro;(function(n){(function(n){var t=function(){function t(n){this.sourceItems=isObservable(n)?ko.unwrap(n):n}return t.prototype.getItems=function(n,t,i,r,u,f){var e=[];e=e.concat(this.sourceItems);this.sort(e,i);e=this.filter(e,r,u);(typeof n=="string"||isNaN(n))&&(n=isNaN(+n)?0:+n);(typeof t=="string"||isNaN(t))&&(t=isNaN(+t)?e.length:+t);e=e.slice(n,n+t);f(e,n,t)},t.prototype.getTotalItemsCount=function(n,t){t(this.filter(this.sourceItems,n,null).length)},t.prototype.addItem=function(n){if(this.sourceItems.push(n),this.onAdd)this.onAdd(n)},t.prototype.removeItem=function(n){for(var t=0;t<this.sourceItems.length;t++)if(this.sourceItems[t]==n){this.sourceItems.splice(t,1);break}if(this.onRemove)this.onRemove(n)},t.prototype.getFirstItem=function(){return this.sourceItems.length>0?this.sourceItems[0]:null},t.prototype.addArray=function(n){this.sourceItems=this.sourceItems.concat(n);this.onReset&&this.onReset()},t.prototype.clear=function(){this.sourceItems=[];this.onReset&&this.onReset()},t.prototype.sort=function(n,t){var i=this;t!=null&&t.length>0&&isNotNull(t[0].path)&&n.sort(function(n,r){return i.compareRecursive(n,r,t,0)})},t.prototype.compareRecursive=function(n,t,i,r){return r!=i.length-1?getMemberValue(n,i[r].path)>getMemberValue(t,i[r].path)?this.sortingOrder(i[r]):getMemberValue(t,i[r].path)>getMemberValue(n,i[r].path)?this.sortingOrderDesc(i[r]):this.compareRecursive(n,t,i,r+1):getMemberValue(n,i[r].path)>getMemberValue(t,i[r].path)?this.sortingOrder(i[r]):this.sortingOrderDesc(i[r])},t.prototype.sortingOrder=function(n){return n.asc?1:-1},t.prototype.sortingOrderDesc=function(n){return n.asc?-1:1},t.prototype.filter=function(n,t,i){var f,e,o,r,s,u;if(t==null&&(i==null||i.length==0))return n;for(i==undefined&&(i=[]),f=[],e=0;e<i.length;e++)f.push(!1);for(o=[],r=0;r<n.length;r++)if(this.isFilterSatisfied(n[r],t)){for(s=!1,u=0;u<i.length;u++)if(this.isFilterSatisfied(n[r],i[u])){f[u]?s=!0:f[u]=!0;break}s||o.push(n[r])}return o},t.prototype.isFilterSatisfied=function(t,i){return this.isFilterConditionSatisfied(t[i.path],i.value,i.condition)?i.children.length==0||i.parentChildUnionOperator==n.LogicalOperator.Or?!0:this.isChildFiltersSatisfied(t,i):i.parentChildUnionOperator==n.LogicalOperator.And?!1:this.isChildFiltersSatisfied(t,i)},t.prototype.isChildFiltersSatisfied=function(t,i){var r;if(i.childrenUnionOperator==n.LogicalOperator.Or){for(r=0;r<i.children.length;r++)if(this.isFilterConditionSatisfied(t[i.children[r].path],i.children[r].value,i.children[r].condition))return!0;return!1}for(r=0;r<i.children.length;r++)if(!this.isFilterConditionSatisfied(t[i.children[r].path],i.children[r].value,i.children[r].condition))return!1;return!0},t.prototype.isFilterConditionSatisfied=function(t,i,r){switch(r){case n.FilterCondition.None:return!0;case n.FilterCondition.Equals:return t==i;case n.FilterCondition.NotEquals:return t!=i;default:return!1}},t}();n.ArrayItemsProvider=t})(n.TGrid||(n.TGrid={}));var t=n.TGrid})(TesserisPro||(TesserisPro={}))