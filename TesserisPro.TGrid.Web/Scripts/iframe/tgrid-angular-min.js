var __extends=this.__extends||function(n,t){function r(){this.constructor=n}for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);r.prototype=t.prototype;n.prototype=new r},TGrid,TesserisPro;(function(n){(function(t){var i=function(t){function i(){t.apply(this,arguments)}return __extends(i,t),i.prototype.getElemntsSize=function(n,t){var f=0,r=n.children,i,u,e;if(t==null)for(i=0;i<r.length;i++)u=r.item(i),f+=u.clientHeight;else for(i=0;i<r.length;i++)u=r.item(i),e=t[i],e!=null&&t.indexOf(e)>0&&(f+=u.clientHeight);return f},i.prototype.getFirstVisibleItem=function(n,t,i){for(var o,u,f=0,e=n.children,r=0;r<e.length;r++){if(f>i)return u;o=e.item(r);u=t[r];u!=null&&t.indexOf(u)>=0&&(f+=o.clientHeight)}return null},i.prototype.getTableElement=function(){var n=document.createElement("table");return n.className="tgrid-table",n},i.prototype.getFooterViewModel=function(){var t=new n.TGrid.AngularFooterViewModel;return t.angularModuleName="tgrid-footer-module"+i.moduleFooterCounter++,angular.module(t.angularModuleName,[]).controller("tgrid-footer-controller",["$scope",function(n){t.setScope(n)}]),t},i.prototype.getFilterPopupViewModel=function(t){var i=new n.TGrid.AngularFilterPopupViewModel(t),r;return i.angularModuleName="tgrid-filter-popup-module",r=angular.module(i.angularModuleName,[]).controller("tgrid-filter-popup-controller",["$scope",function(n){i.setScope(n)}]),i},i.prototype.updateTableHeadElement=function(t,i,r,u,f){var o,s,h,e,c,v,l,a,b,y,p;if(this.updateGroupByPanel(t,r),i.innerHTML!=null&&i.innerHTML!=""){if(this.showNeededIndents(i,t.groupBySortDescriptors.length,n.TGrid.Grid.getGridObject(i)),t.enableSorting){this.removeArrows(i);var w=i.getElementsByTagName("th"),k=t.columns.length,d=t.columns.length,g=w.length;for(o=k,s=0;o<g,s<d;o,s++)t.columns[s].device.indexOf("desktop")!=-1&&(t.sortDescriptor.path==t.columns[s].sortMemberPath&&t.columns[s].sortMemberPath!=null&&this.addArrows(w[o].getElementsByClassName("tgrid-header-cell-buttons")[0],t,o),o++)}}else{for(h=document.createElement("tr"),this.appendIndent(h,t.columns.length,!0),this.showNeededIndents(h,t.groupBySortDescriptors.length,n.TGrid.Grid.getGridObject(i)),e=0;e<t.columns.length;e++)t.columns[e].device.indexOf("desktop")!=-1&&(c=document.createElement("th"),c.setAttribute("width",t.columns[e].width),v=document.createElement("div"),v.className="tgrid-header-cell-container",l=document.createElement("div"),a=document.createElement("div"),l.className="tgrid-header-cell-content",l.style.overflow="hidden",a.className="tgrid-header-cell-buttons",v.appendChild(l),v.appendChild(a),c.appendChild(v),t.columns[e].header!=null?t.columns[e].header.applyTemplate(l):(b=t.columns[e].member!=null?t.columns[e].member:"",this.buildDefaultHeader(l,b)),t.enableSorting&&(function(i){c.onclick=function(r){return n.TGrid.Grid.getGridObject(r.target).sortBy(t.columns[i].sortMemberPath)}}(e),t.sortDescriptor.path==t.columns[e].sortMemberPath&&t.columns[e].sortMemberPath!=null&&this.addArrows(a,t,e)),this.addFilterButton(t,i,u,a,e),t.columns[e].resizable&&(y=document.createElement("div"),y.className="tgrid-header-column-resize",y.onclick=function(n){return n.stopImmediatePropagation()},function(n,i,r){var e=null,u=0;r.onmousedown=function(i){i.stopImmediatePropagation();console.log("test");u=i.screenX;e=document.onmousemove;document.onmousemove=function(i){u!=0&&(t.columns[n].width=(parseInt(t.columns[n].width)+i.screenX-u).toString(),u=i.screenX,f(t.columns[n]))}};document.onmouseup=function(){document.onmousemove=e;u=0}}(e,c,y),a.appendChild(y)),h.appendChild(c));p=document.createElement("th");p.classList.add("tgrid-placeholder");h.appendChild(p);i.appendChild(h)}},i.prototype.updateTableBodyElement=function(n,t,r,u){var o,e,f;for(n.showDetailFor.isDetailColumn||(n.showDetailFor.column=-1),o=angular.module(i.angularModuleName,[]),e=0;e<r.length;e++)this.appendTableElement(n,t,r[e],0,u,i.angularModuleName,o);f=t.getAttribute("class");f==null||f==undefined||f==""?f="desktop":f.indexOf("desktop")==-1&&(f+=" desktop");t.setAttribute("class",f)},i.prototype.addDetailRow=function(){},i.prototype.updateTableDetailRow=function(n,t,i){var f=t.getElementsByClassName("tgrid-details"),r,u,e,o;for(f.length>0&&f[0].parentNode.removeChild(f[0]),u=0;u<t.children.length;u++)if(t.children.item(u).dataContext==i){r=t.children.item(u);break}r!=null&&(n.isSelected(i)?r.classList.add("selected"):r.classList.remove("selected"),e=this.getActualDetailsTemplate(n),e!=null&&(o=this.buildDetailsRow(n,i,e),insertAfter(r,o)))},i.prototype.updateTableFooterElement=function(n,t,i,r){if(n.tableFooterTemplate==null&&n.enablePaging)this.buildDefaultTableFooterElement(n,t,i);else if(n.tableFooterTemplate!=null){var u=document.createElement("div");u.className="tgrid-footer-container";u.setAttribute("ng-controller","tgrid-footer-controller");n.tableFooterTemplate.applyTemplate(u);t.innerHTML="";n.enablePaging&&this.buildDefaultTableFooterElement(n,t,i);t.appendChild(u);angular.bootstrap(u,[r.angularModuleName])}},i.prototype.updateFilteringPopUp=function(n,t,i){if(n.filterPopup==null)this.buildDefaultFiltringPopUp(n,t);else{var r=document.createElement("div");r.className="tgrid-filter-popup-container";r.setAttribute("ng-controller","tgrid-filter-popup-controller");n.filterPopup.applyTemplate(r);t.innerHTML="";t.appendChild(r);angular.bootstrap(r,[i.angularModuleName])}},i.prototype.appendTableElement=function(n,t,i,r,u,f,e){var o,s;i.isGroupHeader?(o=this.buildGroupHeaderRow(n,i.item),t.appendChild(o)):(s=this.buildRowElement(n,i,t,u,f,e),t.appendChild(s))},i.prototype.buildRowElement=function(t,r,u,f,e){var o=document.createElement("tr"),c,v,s,l,h,a;for(o.classList.add("table-body-row"),t.isSelected(r.item)&&o.classList.add("selected"),c=new n.TGrid.AngularItemViewModel(r.model,r.item,r.grid,r.isGroupHeader),c.angularControllerName="tgrid-row-controller"+i.controllerItemCounter++,v=angular.module(i.angularModuleName,[]),v.controller(c.angularControllerName,["$scope",function(n){c.setScope(n)}]),o.setAttribute("ng-controller",c.angularControllerName),this.appendIndent(o,t.groupBySortDescriptors.length,!1),s=0;s<t.columns.length;s++)t.columns[s].device.indexOf("desktop")!=-1&&(l=document.createElement("td"),h=document.createElement("div"),h.className="tgrid-cell-content",h.style.overflow="hidden",l.appendChild(h),t.columns[s].cell!=null?t.columns[s].cell.applyTemplate(h):t.columns[s].member!=null&&this.createDefaultCell(h,t.columns[s].member),o.appendChild(l));return angular.bootstrap(o,[e]),o.dataContext=r.item,a=document.createElement("td"),a.classList.add("tgrid-placeholder"),o.appendChild(a),function(n){o.onclick=function(i){t.selectionMode!=0&&f(n,i.ctrlKey)}}(r),o},i.prototype.buildDetailsRow=function(t,r,u){var o=document.createElement("tr"),f=document.createElement("td"),e;return this.appendIndent(o,t.groupBySortDescriptors.length,!1),o.classList.add("tgrid-details"),f.setAttribute("colspan",(t.columns.length+1).toString()),u.applyTemplate(f),e=new n.TGrid.AngularItemViewModel(null,r,null,null),e.angularControllerName="tgrid-detail-controller"+i.controllerItemCounter++,angular.module(i.angularModuleName,[]).controller(e.angularControllerName,["$scope",function(n){e.setScope(n)}]),f.setAttribute("ng-controller",e.angularControllerName),o.appendChild(f),angular.bootstrap(f,[i.angularModuleName]),o},i.prototype.buildGroupHeaderRow=function(t,r){var e=document.createElement("tr"),u=document.createElement("td"),o,f;return this.appendIndent(e,r.level,!1),o=t.columns.length+1+t.groupBySortDescriptors.length-r.level,u.setAttribute("colspan",o.toString()),u.classList.add("tgrid-table-group-header"),e.classList.add("tgrid-table-group-header"),t.groupHeaderTemplate!=null?t.groupHeaderTemplate.applyTemplate(u):u=this.createDefaultGroupHeader(u),t.enableCollapsing&&(u.onclick=r.collapse?function(t){n.TGrid.Grid.getGridObject(t.target).removeCollapsedFilters(r.filterDescriptor)}:function(t){n.TGrid.Grid.getGridObject(t.target).setCollapsedFilters(r.filterDescriptor)}),f=new n.TGrid.AngularItemViewModel(null,r.value,null,null),f.angularControllerName="tgrid-groupHeader-controller"+i.controllerItemCounter++,angular.module(i.angularGroupModuleName,[]).controller(f.angularControllerName,["$scope",function(n){f.setScope(n)}]),u.setAttribute("ng-controller",f.angularControllerName),e.appendChild(u),angular.bootstrap(u,[i.angularGroupModuleName]),e},i.prototype.addArrows=function(n,t){var i,r;return t.sortDescriptor.asc&&(i=document.createElement("div"),i.classList.add("tgrid-arrow-up"),n.appendChild(i)),t.sortDescriptor.asc||(r=document.createElement("div"),r.classList.add("tgrid-arrow-down"),n.appendChild(r)),n},i.prototype.removeArrows=function(n){for(var i=n.getElementsByClassName("tgrid-arrow-up"),t=0;t<i.length;t++)i[t].parentNode.removeChild(i[t]),t--;for(i=n.getElementsByClassName("tgrid-arrow-down"),t=0;t<i.length;t++)i[t].parentNode.removeChild(i[t]),t--},i.prototype.updateMobileItemsList=function(n,t,i,r){var f,u;for(n.showDetailFor.isDetailColumn||(n.showDetailFor.column=-1),f=0;f<i.length;f++)this.appendMobileElement(n,t,i[f],0,r);u=t.getAttribute("class");u==null||u==undefined||u==""?u="mobile":u.indexOf("mobile")==-1&&(u+=" mobile");t.setAttribute("class",u);n.showDetailFor.isDetailColumn=!1},i.prototype.updateMobileDetailRow=function(n,t,i){var f=t.getElementsByClassName("tgrid-mobile-details"),r,u,e,o;for(f.length>0&&f[0].parentNode.removeChild(f[0]),u=0;u<t.children.length;u++)if(t.children.item(u).dataContext==i){r=t.children.item(u);break}r!=null&&(n.isSelected(i)?r.classList.add("selected"):r.classList.remove("selected"),e=this.getActualDetailsTemplate(n),e!=null&&(o=this.buildMobileDetailsRow(n,i,e),insertAfter(r,o)))},i.prototype.appendMobileElement=function(n,t,i,r,u){var f,e;i.isGroupHeader?(f=this.buildGroupMobileHeaderRow(n,i.item),t.appendChild(f)):(e=this.buildMobileRowElement(n,i,t,u),t.appendChild(e))},i.prototype.buildMobileRowElement=function(t,r,u,f){var e=document.createElement("div"),h,o,s,c;for(e.classList.add("tgrid-mobile-row"),t.isSelected(r.item)&&e.classList.add("selected"),h=0;h<t.groupBySortDescriptors.length;h++)e.innerHTML+="<div class='tgrid-mobile-indent-div'><\/div>";return o=document.createElement("div"),o.classList.add("tgrid-mobile-div"),t.mobileTemplateHtml!=null?t.mobileTemplateHtml.applyTemplate(o):o=this.createDefaultMobileTemplate(o,t),e.appendChild(o),s=new n.TGrid.AngularItemViewModel(r.model,r.item,r.grid,r.isGroupHeader),s.angularControllerName="tgrid-mobile-row-controller"+i.controllerItemCounter++,angular.module(i.angularModuleName).controller(s.angularControllerName,["$scope",function(n){s.setScope(n)}]),e.setAttribute("ng-controller",s.angularControllerName),angular.bootstrap(e,[i.angularModuleName]),e.dataContext=r.item,c=document.createElement("td"),c.classList.add("tgrid-placeholder"),e.appendChild(c),function(n){e.onclick=function(i){if(t.selectionMode!=0){var r=u;f(n,i.ctrlKey)}}}(r),e},i.prototype.createDefaultGroupHeader=function(n){var i=document.createElement("div"),t=document.createElement("span");return t.innerHTML="{{item}}",t.setAttribute("style","color: green;"),i.appendChild(t),n.appendChild(i),n},i.prototype.buildMobileDetailsRow=function(t,r,u){var f=document.createElement("div"),e;return f.classList.add("tgrid-mobile-details"),u.applyTemplate(f),e=new n.TGrid.AngularItemViewModel(null,r,null,null),e.angularControllerName="tgrid-detail-controller"+i.controllerItemCounter++,angular.module(i.angularModuleName,[]).controller(e.angularControllerName,["$scope",function(n){e.setScope(n)}]),f.setAttribute("ng-controller",e.angularControllerName),angular.bootstrap(f,[i.angularModuleName]),f},i.prototype.bindMobileGroupHeader=function(t,r,u){var f=new n.TGrid.AngularItemViewModel(null,r,null,null);f.angularControllerName="tgrid-groupHeader-controller"+i.controllerItemCounter++;angular.module(i.angularGroupModuleName,[]).controller(f.angularControllerName,["$scope",function(n){f.setScope(n)}]);u.setAttribute("ng-controller",f.angularControllerName);t.appendChild(u);angular.bootstrap(u,[i.angularGroupModuleName])},i.prototype.createDefaultCell=function(n,t){var i=document.createElement("span"),r="{{item.".concat(t).concat("}}");i.innerHTML=r;n.appendChild(i)},i.prototype.createDefaultMobileTemplate=function(n,t){for(var u,f,r,e,i=0;i<t.columns.length;i++)t.columns[i].device.indexOf("mobile")!=-1&&(u=document.createElement("div"),f=document.createElement("span"),f.innerHTML=t.columns[i].member!=null?t.columns[i].member:t.columns[i].sortMemberPath!=null?t.columns[i].sortMemberPath:t.columns[i].groupMemberPath!=null?t.columns[i].groupMemberPath:"",r=document.createElement("span"),t.columns[i].member!=null?(e=document.createElement("span"),r.innerHTML=" : {{item."+t.columns[i].member+"}}",r.appendChild(e)):r.innerHTML=": ",u.appendChild(f),u.appendChild(r),n.appendChild(u));return n},i.moduleFooterCounter=0,i.controllerItemCounter=0,i.angularModuleName="tgrid-row-module",i.angularGroupModuleName="tgrid-group-module",i}(n.TGrid.BaseHtmlProvider);t.AngularHtmlProvider=i})(n.TGrid||(n.TGrid={}));var t=n.TGrid})(TesserisPro||(TesserisPro={})),function(n){(function(n){var t=function(){function n(){this.directive={};this.directive.restrict="E";this.directive.link=function(n,t,i){var r=new TesserisPro.TGrid.Options(t[0],1),u,e,o,s,f,h;if(i.groupby!=undefined&&(u=i.groupby.split(" "),u.length>0&&u[0]!=""))for(e=0;e<u.length;e++)r.groupBySortDescriptors.push(new TesserisPro.TGrid.SortDescriptor(u[e],!0));r.enablePaging=i.enablepaging==undefined?!1:i.enablepaging=="true"?!0:!1;o=i.pagesize;o!=undefined&&(r.pageSize=parseInt(o),this.isEnablePaging&&(r.pageSize=isNaN(this.pageSize)||this.pageSize<1?10:this.pageSize));s=i.pageslide;r.pageSlide=parseInt(s);this.isEnablePaging&&(r.pageSlide=isNaN(this.pageSlide)||this.pageSlide<1?1:this.pageSlide);f=i.selectionmode;f=="multi"&&(r.selectionMode=2);(f==undefined||f=="single")&&(r.selectionMode=1);f=="none"&&(r.selectionMode=0);r.enableVirtualScroll=i.enablevirtualscroll==undefined?!1:i.enablevirtualscroll=="true"?!0:!1;r.enableCollapsing=i.enablecollapsing==undefined?!1:i.enablecollapsing=="true"?!0:!1;r.enableSorting=i.enablesorting==undefined?!1:i.enablesorting=="true"?!0:!1;r.enableGrouping=i.enablegrouping==undefined?!1:i.enablegrouping=="true"?!0:!1;r.openDetailsOnSelection=i.showdetailsonselection==undefined?!1:i.showdetailsonselection=="true"?!0:!1;r.enableFiltering=i.enablefiltering==undefined?!1:i.enablefiltering=="true"?!0:!1;h=new TesserisPro.TGrid.Grid(t[0],r,n[i.provider])}}return n}();n.Directive=t})(n.Angular||(n.Angular={}));var t=n.Angular}(TGrid||(TGrid={})),function(n){(function(n){var t=function(){function n(){this.totalCount=0;this.selectedItem=null;this.currentPage=1;this.totalPages=1}return n.prototype.setScope=function(n){this.$scope=n;this.$scope.totalCount=this.totalCount;this.$scope.selectedItem=this.selectedItem;this.$scope.currentPage=this.currentPage;this.$scope.totalPages=this.totalPages},n.prototype.setTotalCount=function(n){this.totalCount=n;this.$scope!=null&&(this.$scope.totalCount=n,this.$scope.$apply())},n.prototype.setSelectedItem=function(n){this.selectedItem=n;this.$scope!=null&&(this.$scope.selectedItem=n,this.$scope.$apply())},n.prototype.setCurrentPage=function(n){this.currentPage=n;this.$scope!=null&&(this.$scope.currentPage=n,this.$scope.$apply())},n.prototype.setTotalPages=function(n){this.totalPages=n;this.$scope!=null&&(this.$scope.totalPages=n,this.$scope.$apply())},n}();n.AngularFooterViewModel=t})(n.TGrid||(n.TGrid={}));var t=n.TGrid}(TesserisPro||(TesserisPro={})),function(n){(function(t){var i=function(){function t(n){this.container=n}return t.prototype.setScope=function(n){var t=this;this.$scope=n;this.$scope.onApply=function(){return t.onApply()};this.$scope.onClear=function(){return t.onClear()};this.$scope.onClose=function(){return t.onClose()}},t.prototype.onApply=function(){if(this.condition=this.container.getElementsByTagName("select")[0].selectedIndex,this.condition!=0){this.value=this.container.getElementsByTagName("input")[0].value;var t=new n.TGrid.FilterDescriptor(this.path,this.value,this.condition),i=n.TGrid.Grid.getGridObject(this.container);i.setFilters(t,this.path)}else n.TGrid.Grid.getGridObject(this.container).removeFilters(this.path);hideElement(this.container)},t.prototype.onClear=function(){n.TGrid.Grid.getGridObject(this.container).removeFilters(this.path);hideElement(this.container)},t.prototype.onClose=function(){hideElement(this.container)},t.prototype.onOpen=function(t,i){n.TGrid.Grid.getGridObject(this.container).setDefaultFilterPopUpValues();this.path=i.filterMemberPath;this.columnInfo=i;for(var r=0;r<t.filterDescriptors.length;r++)t.filterDescriptors[r].path==i.filterMemberPath&&(this.container.getElementsByTagName("input")[0].value=t.filterDescriptors[r].value,this.container.getElementsByTagName("select")[0].selectedIndex=t.filterDescriptors[r].condition)},t.prototype.getColumnInfo=function(){return this.columnInfo},t}();t.AngularFilterPopupViewModel=i})(n.TGrid||(n.TGrid={}));var t=n.TGrid}(TesserisPro||(TesserisPro={}));__extends=this.__extends||function(n,t){function r(){this.constructor=n}for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);r.prototype=t.prototype;n.prototype=new r},function(n){(function(t){var i=function(n){function t(){n.apply(this,arguments)}return __extends(t,n),t.prototype.setScope=function(n){var t=this;this.$scope=n;this.$scope.model=this.model;this.$scope.item=this.item;this.$scope.grid=this.grid;this.$scope.isGroupHeader=this.isGroupHeader;this.$scope.showDetailForCell=function(n){return t.showDetailForCell(n)}},t}(n.TGrid.ItemViewModel);t.AngularItemViewModel=i})(n.TGrid||(n.TGrid={}));var t=n.TGrid}(TesserisPro||(TesserisPro={}))