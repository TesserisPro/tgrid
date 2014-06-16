####rowClick

Sets row click handler function name, which can be used in your sample view model to set your action on row click. Handler function has 2 parameters: *item* and *event*. *Item* is an element of your itemsProvider array, binded to clicked row. *Event* is mouse event click.

If **rowClick** is defined, then **selectionMode** is set to 'none' and **showDetailsOnSelection** is set to 'false'.

**Value:** any string.

**Default value:** null.

**Example:**

#####For Knockout
In HTML:
<!--Start the highlighter-->
<pre class="brush: html">
	<div data-bind="tgrid: { provider: itemsProvider, rowClick: rowClickHandler}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **ready** value. 

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.rowClickHandler = function (item, event) {
       alert("item: " + item);
	}
}
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid provider="itemsProvider" rowClick="rowClickHandler">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **ready** value. 

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
		$scope.rowClickHandler = function (item, event) {
			alert("item: " + item);
		}
	}
</pre>

#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>