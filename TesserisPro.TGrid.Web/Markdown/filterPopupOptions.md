####filterPopup

**filterPopup** is for internal use. 

Type of this variable is a TesserisPro.TGrid.Template. 
Constructor of the TesserisPro.TGrid.Template accepts a HTML DOM element. 
This HTML DOM element can contain data-bindins.

To create the template use code:
<!--Start the highlighter-->
<pre class="brush: js">

var template = new TesserisPro.TGrid.Template(htmlElement);

</pre>
####

A filter popup template isn't required. There is a default filter popup template. A default filter popup template is used, if a filter popup template isn't defined.

**Example:**

![filterPopupTemplate](../Content/images/imagesForDocs/filterPopupTemplate.jpg)
#####For Knockout
Example of a grid with details settings, a details template and one column:

<pre class="brush: html">
<div data-bind="tgrid: { provider: itemsProvider, enableFiltering: true}">
   <script type="text/html">
   	  <column data-g-member="Name">
   	  </column>
   	  <filterpopup>
        <div><span data-bind="text: path"></span></div>
        <select data-bind="click: function(){}">
            <option value="0">None</option>
            <option value="1">Equals</option>
            <option value="2">Not Equals</option>
        </select>
        <input type='text' value=""/><br>
        <div class="tgrid-filter-popup-button" style="width:70px" data-bind="click: onApply">
   	  	    OK
   	  	</div>
        <div class="tgrid-filter-popup-button" style="width:70px" data-bind="click: onClose">
   	  	   Cancel
   	  	</div>
      </filterpopup>
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

Example of a grid with details settings, a details template and one column:
<pre class="brush: html">
	<div ng-app="SampleModule"> 
        <div ng-controller="ctrl">
          <t-grid id="test-angular" provider="dataProvider" enablefiltering="true">
            <script type="text/html">
                <column data-g-member="Name" data-g-filter-member="Name">
                </column>
                <filterpopup>
                    <div><span>{{path}}</span></div>
                    <select>
                        <option value="0">None</option>
                        <option value="1">Equals</option>
                        <option value="2">Not Equals</option>
                    </select>
                    <input type="text" value=""><br>
                    <div class="tgrid-filter-popup-button" style="width:70px" ng-click="onApply()">
                        OK
                    </div>
                    <div class="tgrid-filter-popup-button" style="width:70px" ng-click="onClose()">
                        Cancel
                    </div>
                </filterpopup>
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

#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
