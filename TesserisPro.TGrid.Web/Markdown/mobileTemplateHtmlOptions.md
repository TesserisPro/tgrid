####mobileTemplateHtml

**mobileTemplateHtml** is for internal use. 

Type of this variable is TesserisPro.TGrid.Template. 
Constructor of TesserisPro.TGrid.Template accepts HTML DOM element. 
This HTML DOM element can contain data-bindins.

To create template use code:
<!--Start the highlighter-->
<pre class="brush: js">

var template = new TesserisPro.TGrid.Template(htmlElement);

</pre>
####
For simple grid you don't have to define mobile template in  HTML. 
Mobile rows are created automatically, for columns, which are defined in HTML template. 
Column definitions for mobile also are inherited from columns. 
Cell templates, header templates and cell details templates are not inherited and should be overrided in custom mobile template.  

![mobileTemplateHtmlGrouping](../Content/images/imagesForDocs/mobileTemplateGrouping.jpg)
#####For Knockout
<pre class="brush: html">
<div data-bind="tgrid:{provider:itemsProvider,enableGrouping:true,enableCollapsing:true}">
    <script type="text/html">
        <column data-g-member="Name" data-g-group-member="Name"> 
        </column>
        <column data-g-member="Surname" data-g-group-member="Surname">
        </column>
        <column data-g-member="Age" data-g-group-member="Age">
    </script>           
</div>
</pre>
#####For Angular
<pre class="brush:html">
<div ng-app="SampleModule"> 
    <div ng-controller="ctrl">
        <t-grid provider="dataProvider" enablegrouping="true" enablecollapsing="true">
            <script type="text/html">
                <column data-g-member="Name" data-g-group-member="Name">
                </column>
                <column data-g-member="Surname" data-g-group-member="Surname">
                </column>
                <column data-g-member="Age" data-g-group-member="Age">
                </column>
            </script>
        </t-grid>
    </div>
</div>
</pre>
Example of custom **mobileTemplateHtml** with template for cell details:

![mobileTemplateHtml](../Content/images/imagesForDocs/mobileTemplate.jpg)

#####For Knockout
In HTML TGrid template part that defines **mobileTemplateHtml** is:
<pre class="brush:html">
<mobile>
	<div>
		<span>First name: </span>
		<span data-bind="text: item.Name"></span>
		<a href data-bind="click: function(){toggleDetailsForCell(0);},clickBubble:false">
		...
		</a>
		<br />
		<span>Last name: </span>
		<span data-bind="text: item.Surname"></span>
		<br />
		<span>Age: </span>
		<span data-bind="text: item.Age"></span>
	</div>
</mobile>
</pre>
####
To see details you should also define cell details template. All HTML code is:
<pre class="brush:html">
    <div id="test-knockout" data-bind="tgrid: { provider: itemsProvider}">
        <script type="text/html">
            <column data-g-member="Name"> 
                <celldetail>
                   <div>
                      <div>This is a sample of cell details: </div>
                      <div style="color: #444;" data-bind="text: item.detail_Name"></div>
                   </div>
                </celldetail>
            </column>
            <mobile>
                <div>
                  <span>First name: </span>
                  <span data-bind="text: item.Name"></span>
                  <a data-bind="click: function(){toggleDetailsForCell(0);},clickBubble:false">
				     ...
				  </a>
                  <br />
                  <span>Last name: </span>
                  <span data-bind="text: item.Surname"></span>
                  <br />
                  <span>Age: </span>
                  <span data-bind="text: item.Age"></span>
                </div>
            </mobile>
        </script>
    </div>
</pre>
####
Javascript:
<pre class="brush:js">
var items = [
        { Name: "John", Surname: "Figgins", Age: "20", detail_Name: "First name:  John"},
        { Name: "Sharilyn", Surname: "Ham", Age: "52", detail_Name: "First name: Sharilyn"}
    //... more items
];
function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
};

$(function () {
    ko.applyBindings(new vm());
});
</pre>
#####For Angular
In HTML TGrid template part that defines **mobileTemplateHtml** is:
<pre class="brush:html">
<mobile>
  <div>
  	<span>First Name: </span>
  	<span>{{item.item.Name}}</span>
  	<a href ng-click="item.toggleDetailsForCell(0,item,items);$event.stopPropagation();">
  		...
  	</a>
  	<br />
  	<span>Last Name: </span>
  	<span>{{item.item.Surname}}</span>
  	<br />
  	<span>Age: </span>
  	<span>{{item.item.Age}}</span>
  	<br />
  </div>       
</mobile>
</pre>
####
To see details you should also define cell details template. Full HTML code is:
<pre class="brush:html">
<div ng-app="SampleModule"> 
  <div ng-controller="ctrl">
   <t-grid id="test-angular" provider="dataProvider" showdetailsonselection="true">
      <script type="text/html">
         <column data-g-member="Name"> 
            <celldetail>
               <div>
               <div>This is a sample of cell details: </div>
               <div style="color: #444;"> {{item.item.detail_Name}}</div>
               </div>
            </celldetail>
        </column>
        <column data-g-member="Surname">
        </column>
        <column data-g-member="Age">
        </column>
          <mobile>
		   <span>First Name: </span>
		   <span>{{item.item.Name}}</span>
		   <a href ng-click="item.toggleDetailsForCell(0,item,items);$event.stopPropagation();">
		   	...
		   </a>
		   <br />
		   <span>Last Name: </span>
		   <span>{{item.item.Surname}}</span>
		   <br />
		   <span>Age: </span>
		   <span>{{item.item.Age}}</span>
		   <br />
		   </div>       
		  </mobile>
       </script>
     </t-grid>
  </div>
</div>
</pre>
####
Javascript:
<pre class="brush:js">
  var items = [
  		{ Name: "John", Surname: "Figgins", Age: "20", detail_Name: "First name:  John"},
  		{ Name: "Sharilyn", Surname: "Ham", Age: "52", detail_Name: "First name: Sharilyn"}
  	//... more items
  ];
  var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    })
</pre>
####
<script type="text/javascript">
	SyntaxHighlighter.highlight();
</script>
