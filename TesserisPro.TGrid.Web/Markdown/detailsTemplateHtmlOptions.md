####detailsTemplateHtml

The **detailsTemplateHtml** setting is for internal use. 

Type of the setting is TesserisPro.TGrid.Template. 
Constructor of a TesserisPro.TGrid.Template accepts a HTML DOM element. 
This HTML DOM element can contain data-bindins.

To create template use code:
<!--Start the highlighter-->
<pre class="brush: js">

var template = new TesserisPro.TGrid.Template(htmlElement);

</pre>
####

To make details working on selection you should define an html details template in TGrid description.

**Example:**

![detailsTemplateHtml](../Content/images/imagesForDocs/detailsTemplate.jpg)

#####For Knockout
Example of a grid template with a details settings and a details template:

<pre class="brush: html">
	<div data-bind="tgrid: { provider: itemsProvider, showDetailsOnSelection: true}">
		  <script type="text/html">
			<column data-g-member="Name">
			</column>
		    <details>
                <div>This is a sample of row details </div>
            </details>
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

Example of a grid template with details settings and details template, and one column:
<pre class="brush: html">
	<div ng-app="SampleModule"> 
        <div ng-controller="ctrl">
			<t-grid id="test-angular" provider="dataProvider" showDetailsOnSelection="true">
				<script type="text/html">
					<column data-g-member="Name">
					</column>
					<details>
						<div>This is a sample of table row details </div>
					</details>
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



