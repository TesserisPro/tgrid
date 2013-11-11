var __extends=this.__extends||function(n,t){function r(){this.constructor=n}for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);r.prototype=t.prototype;n.prototype=new r},TesserisPro,TGridBindingHandler;(function(n){(function(t){var i=function(i){function r(){i.apply(this,arguments)}return __extends(r,i),r.prototype.getTableElement=function(){var n=document.createElement("table");return n.className="tgrid-table",n},r.prototype.getElemntsSize=function(n,t){for(var r,u,f=0,e=n.children,i=0;i<e.length;i++)r=e.item(i),u=ko.contextFor(r).$root,u!=null&&t.indexOf(u)>0&&(f+=r.clientHeight);return f},r.prototype.getFirstVisibleItem=function(n,t,i){for(var f,r,e=0,o=n.children,u=0;u<o.length;u++)if(f=o.item(u),r=ko.contextFor(f).$root,r!=null&&t.indexOf(r)>0&&(e+=f.clientHeight),e>i)return r;return null},r.prototype.updateTableHeadElement=function(n,i,r,u,f){var h,c,s,e,o,v,l,a;if(i.innerHTML!=null&&i.innerHTML!=""){if(this.showNeededIntends(i,n.groupBySortDescriptor.length,t.Grid.getGridObject(i)),f)for(this.removeArrows(i),h=i.getElementsByTagName("th"),e=n.columns.length,c=0;e<h.length,c<n.columns.length;e++,c++)n.sortDescriptor.path==n.columns[c].sortMemberPath&&(h[e]=this.addArrows(h[e],n,e));this.updateGroupByElements(n,i,r)}else{for(this.addGroupBy(n,i,r),s=document.createElement("tr"),this.appendIndent(s,n.columns.length,!0),this.showNeededIntends(s,n.groupBySortDescriptor.length,t.Grid.getGridObject(i)),e=0;e<n.columns.length;e++)o=document.createElement("th"),o.setAttribute("width",n.columns[e].width),n.columns[e].header!=null?n.columns[e].header.applyTemplate(o):(v=n.columns[e].member!=null?n.columns[e].member:"",o=this.createDefaultHeader(o,v)),n.isEnableFiltering&&(l=document.createElement("div"),l.setAttribute("class","tgrid-filter-button"),function(r){l.onclick=function(f){for(var s,o=f.target.offsetLeft,e=0;e<r;e++)o+=parseInt(n.columns[e].width);if(s=i.getElementsByClassName("tgrid-table-indent-cell"),s.length>0)for(e=0;e<n.groupBySortDescriptor.length;e++)o+=20;t.Grid.getGridObject(f.target).showFilterBox(u,n.columns[r].sortMemberPath,o);f.cancelBubble=!0}}(e),o.appendChild(l)),function(i){o.onclick=function(r){return t.Grid.getGridObject(r.target).sortBy(n.columns[i].sortMemberPath)}}(e),f&&n.sortDescriptor.path==n.columns[e].sortMemberPath&&(o=this.addArrows(o,n,e)),s.appendChild(o);a=document.createElement("th");a.setAttribute("class","tgrid-placeholder");s.appendChild(a);i.appendChild(s)}},r.prototype.updateTableBodyElement=function(n,t,i,r){var f,u;for(n.showDetailFor.isDetailColumn||(n.showDetailFor.column=-1),f=0;f<i.length;f++)this.appendTableElement(n,t,i[f],0,r);u=t.getAttribute("class");u==null||u==undefined||u==""?u="desktop":u.indexOf("desktop")==-1&&(u+=" desktop");t.setAttribute("class",u)},r.prototype.updateTableDetailRow=function(n,i,r){var e=i.getElementsByClassName("details"),u,o,f;if(e.length>0&&e[0].parentNode.removeChild(e[0]),n.selectionMode==t.SelectionMode.Multi){if(!n.ctrlKey)for(u=0;u<i.children.length;u++)i.children.item(u).removeAttribute("class");n.isSelected(r)?n.selectedRow.setAttribute("class","selected"):n.selectedRow.removeAttribute("class")}if(n.selectionMode==t.SelectionMode.Single){for(u=0;u<i.children.length;u++)i.children.item(u).removeAttribute("class");n.isSelected(r)?n.selectedRow.setAttribute("class","selected"):n.selectedRow.removeAttribute("class")}o=i.getElementsByClassName("selected");this.hasDetails(o,n)&&(f=this.buildDetailsRow(n),f.setAttribute("class","details"),insertAfter(o[0],f),ko.applyBindings(n.showDetailFor,f))},r.prototype.updateTableFooterElement=function(n,t,i,r){if(r==null&&n.isEnablePaging)this.updateTableFooterElementDefault(n,t,i);else if(n.tableFooterTemplate!=null){n.tableFooterTemplate.applyTemplate(t);var u=document.getElementsByClassName("selected");r.selectedItem=u.length==1?u[0]:u.length+" elements are selected";ko.applyBindings(r,t)}},r.prototype.addFiltringPopUp=function(n,t,i){n.filterPopup==null?this.defaultFiltringPopUp(n,t):(n.filterPopup.applyTemplate(t),ko.applyBindings(i,t))},r.prototype.appendTableElement=function(n,t,i,r,u){var f,e;i.isGroupHeader?(f=this.buildGroupHeaderRow(n,i.item),t.appendChild(f),ko.applyBindings(i,f)):(e=this.buildRowElement(n,i,t,u),t.appendChild(e),ko.applyBindings(i,e))},r.prototype.buildRowElement=function(n,i,r,u){var e=document.createElement("tr"),f,o,s;for(n.isSelected(i.item)&&e.setAttribute("class","selected"),this.appendIndent(e,n.groupBySortDescriptor.length,!1),f=0;f<n.columns.length;f++)o=document.createElement("td"),o.setAttribute("width",n.columns[f].width),n.columns[f].cell!=null?n.columns[f].cell.applyTemplate(o):n.columns[f].member!=null&&(o=this.createDefaultCell(o,n.columns[f].member)),e.appendChild(o);return s=document.createElement("td"),s.setAttribute("class","tgrid-placeholder"),e.appendChild(s),function(i){e.onclick=function(r){n.selectionMode!=t.SelectionMode.None&&(n.ctrlKey=r.ctrlKey,n.selectedRow=this,u(i,r.ctrlKey))}}(i),e},r.prototype.buildDetailsRow=function(n){var t=document.createElement("tr"),i=document.createElement("td");return this.appendIndent(t,n.groupBySortDescriptor.length,!1),t.setAttribute("class","details"),i.setAttribute("colspan",(n.columns.length+1).toString()),n.showDetailFor.column==-1?n.detailsTemplateHtml.applyTemplate(i):n.columns[n.showDetailFor.column].cellDetail.applyTemplate(i),t.appendChild(i),t},r.prototype.buildGroupHeaderRow=function(t,i){var u=document.createElement("tr"),r=document.createElement("td"),f;return this.appendIndent(u,i.level,!1),f=t.columns.length+1+t.groupBySortDescriptor.length-i.level,r.setAttribute("colspan",f.toString()),r.setAttribute("class","tgrid-table-group-header"),t.isEnableCollapsing&&(r.onclick=i.collapse?function(t){n.TGrid.Grid.getGridObject(t.target).removeCollapsedFilters(i.filterDescriptor)}:function(t){n.TGrid.Grid.getGridObject(t.target).setCollapsedFilters(i.filterDescriptor)}),t.groupHeaderTemplate!=null?t.groupHeaderTemplate.applyTemplate(r):r=this.createDefaultGroupHeader(r),u.appendChild(r),u},r.prototype.addArrows=function(n,t){var i,r;return t.sortDescriptor.asc&&(i=document.createElement("div"),i.classList.add("tgrid-arrow-up"),n.appendChild(i)),t.sortDescriptor.asc||(r=document.createElement("div"),r.classList.add("tgrid-arrow-down"),n.appendChild(r)),n},r.prototype.removeArrows=function(n){var t=n.getElementsByClassName("tgrid-arrow-up");t.length==1&&t[0].parentNode.removeChild(t[0]);t=n.getElementsByClassName("tgrid-arrow-down");t.length==1&&t[0].parentNode.removeChild(t[0])},r.prototype.appendIndent=function(n,t,i){for(var r,f=i?"th":"td",u=0;u<t;u++)r=document.createElement(f),r.className="tgrid-table-indent-cell",n.appendChild(r)},r.prototype.updateMobileHeadElement=function(n,i,r){var c,l,a,v,f,u,h;if(i.innerHTML!=null&&i.innerHTML!="")for(this.removeArrows(i),c=document.getElementsByClassName("tgrid-inline-block"),n.sortDescriptor.asc?(l=document.createElement("div"),l.classList.add("tgrid-arrow-up"),c[0].appendChild(l)):(a=document.createElement("div"),a.classList.add("tgrid-arrow-down"),c[0].appendChild(a)),v=document.getElementsByTagName("select"),u=0;u<n.columns.length;u++)n.columns[u].sortMemberPath==n.sortDescriptor.path&&(v[0].selectedIndex=u);else if(f=i.getAttribute("class"),f==null||f==undefined||f==""?f="mobile":f+=" mobile",i.setAttribute("class",f),r){var s=document.createElement("div"),o=document.createElement("div"),e=document.createElement("select");for(e.onchange=function(n){t.Grid.getGridObject(n.target).sortBy(e.options[e.selectedIndex].value)},u=0;u<n.columns.length;u++)h=document.createElement("option"),h.value=n.columns[u].sortMemberPath,h.text=n.columns[u].sortMemberPath,e.appendChild(h),n.columns[u].sortMemberPath==n.sortDescriptor.path&&(o=this.addArrows(o,n,u));o.classList.add("tgrid-inline-block");s.innerHTML+="Sorting by ";s.appendChild(e);s.appendChild(o);o.onclick=function(n){t.Grid.getGridObject(n.target).sortBy(e.options[e.selectedIndex].value)};i.appendChild(s)}else i.innerHTML="<div><\/div>"},r.prototype.updateMobileItemsList=function(n,t,i,r){var f,u;for(n.showDetailFor.isDetailColumn||(n.showDetailFor.column=-1),f=0;f<i.length;f++)this.appendMobileElement(n,t,i[f],0,r);u=t.getAttribute("class");u==null||u==undefined||u==""?u="mobile":u.indexOf("mobile")==-1&&(u+=" mobile");t.setAttribute("class",u);n.showDetailFor.isDetailColumn=!1},r.prototype.updateMobileDetailRow=function(n,i,r){var e=i.getElementsByClassName("details"),u,o,f;if(e.length>0&&e[0].parentNode.removeChild(e[0]),n.selectionMode==t.SelectionMode.Multi){if(!n.ctrlKey)for(u=0;u<i.children.length;u++)i.children.item(u).setAttribute("class","tgrid-mobile-row");n.isSelected(r.item)?n.selectedRow.setAttribute("class",n.selectedRow.getAttribute("class")+" selected"):i.children.item(u).setAttribute("class","tgrid-mobile-row")}if(n.selectionMode==t.SelectionMode.Single){for(u=0;u<i.children.length;u++)i.children.item(u).setAttribute("class","tgrid-mobile-row");n.isSelected(r)?n.selectedRow.setAttribute("class",n.selectedRow.getAttribute("class")+" selected"):i.children.item(u).setAttribute("class","tgrid-mobile-row")}o=i.getElementsByClassName("selected");this.hasDetails(o,n)&&(f=this.buildMobileDetailsRow(n),f.setAttribute("class","details"),insertAfter(o[0],f),ko.applyBindings(n.showDetailFor,f))},r.prototype.appendMobileElement=function(n,t,i,r,u){var f,e;i.isGroupHeader&&n.groupHeaderTemplate!=null?(f=this.buildGroupMobileHeaderRow(n,i.item),t.appendChild(f),ko.applyBindings(i,f)):(e=this.buildMobileRowElement(n,i,t,u),t.appendChild(e),ko.applyBindings(i,e))},r.prototype.buildMobileRowElement=function(n,i,r,u){var f=document.createElement("div"),o,e,s;for(f.setAttribute("class","tgrid-mobile-row"),n.isSelected(i.item)&&f.setAttribute("class","selected tgrid-mobile-row"),o=0;o<n.groupBySortDescriptor.length;o++)f.innerHTML+="<div class='tgrid-mobile-indent-div'><\/div>";return e=document.createElement("div"),e.setAttribute("class","tgrid-mobile-div"),n.mobileTemplateHtml!=null?n.mobileTemplateHtml.applyTemplate(e):e=this.createDefaultMobileTemplate(e,n),f.appendChild(e),s=document.createElement("td"),s.setAttribute("class","tgrid-placeholder"),f.appendChild(s),function(i){f.onclick=function(f){if(n.selectionMode!=t.SelectionMode.None){n.ctrlKey=f.ctrlKey;n.selectedRow=this;var e=r;u(i,f.ctrlKey)}}}(i),f},r.prototype.buildMobileDetailsRow=function(n){var t=document.createElement("div");return t.setAttribute("class","tgrid-mobile-details "),n.showDetailFor.column==-1?n.detailsTemplateHtml.applyTemplate(t):n.columns[n.showDetailFor.column].cellDetail.applyTemplate(t),t},r.prototype.buildGroupMobileHeaderRow=function(t,i){var r=document.createElement("div");return r.setAttribute("class","tgrid-mobile-group-header "),r.setAttribute("style","padding-left: "+20*i.level+"px !important;"),t.isEnableCollapsing&&(r.onclick=i.collapse?function(t){n.TGrid.Grid.getGridObject(t.target).removeCollapsedFilters(i.filterDescriptor)}:function(t){n.TGrid.Grid.getGridObject(t.target).setCollapsedFilters(i.filterDescriptor)}),t.groupHeaderTemplate!=null&&t.groupHeaderTemplate.applyTemplate(r),r},r.prototype.createDefaultCell=function(n,t){var i=document.createElement("span"),r="text: item.".concat(t);return i.setAttribute("data-bind",r),n.appendChild(i),n},r.prototype.createDefaultGroupHeader=function(n){var i=document.createElement("div"),t=document.createElement("span");return t.setAttribute("data-bind","text: item.value"),t.setAttribute("style","color: green;"),i.appendChild(t),n.appendChild(i),n},r}(t.BaseHtmlProvider);t.KnockoutHtmlProvider=i})(n.TGrid||(n.TGrid={}));var t=n.TGrid})(TesserisPro||(TesserisPro={}));TGridBindingHandler=function(){function n(){this.options=null}return n.prototype.init=function(n,t){var i=new TesserisPro.TGrid.Options(n,TesserisPro.TGrid.Framework.Knockout),r,u,f,e;if(t().groupBy!=undefined)for(r=0;r<t().groupBy.length;r++)i.groupBySortDescriptor.push(new TesserisPro.TGrid.SortDescriptor(t().groupBy[r],!0));i.isEnablePaging=t().enablePaging==undefined?!1:t().enablePaging=="true"?!0:!1;u=t().pageSize;i.pageSize=parseInt(u);i.isEnablePaging&&(i.pageSize=isNaN(i.pageSize)||i.pageSize<1?10:i.pageSize);f=t().selectMode;i.selectionMode=parseInt(f);isNaN(i.selectionMode)&&(i.selectionMode=1);i.isEnableVirtualScroll=t().enableVirtualScroll==undefined?!0:t().enableVirtualScroll=="true"?!0:!1;i.isEnableCollapsing=t().enableCollapsing==undefined?!0:t().enableCollapsing=="true"?!0:!1;i.isEnableGrouping=t().enableGrouping==undefined?!0:t().enableGrouping=="true"?!0:!1;i.isEnableFiltering=t().enableFiltering==undefined?!0:t().enableFiltering=="true"?!0:!1;e=new TesserisPro.TGrid.Grid(n,i,t().provider)},n.prototype.update=function(){},n}();ko.bindingHandlers.tgrid=new TGridBindingHandler