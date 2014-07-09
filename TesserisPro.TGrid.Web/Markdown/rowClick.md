####rowClick

Sets a row click handler function name, which can be used in your sample view model to set your action on a row click. The handler function has 2 parameters: an *item* and an *event*. The *item* is an element of your itemsProvider array, binded to the clicked row. The *event* is a mouse event click.

If the **rowClick** setting is defined, then the **selectionMode** setting is set to 'none' and the **showDetailsOnSelection** setting is set to 'false'.

**Value:** a string.

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
In Javascript in a knockout view model you should have an observable variable with a name that equals the **rowClick** value. 

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
	<t-grid provider="dataProvider" rowClick="rowClickHandler">
	</t-grid>
</pre>
#####
In Javascript in an angular controller you should have a variable with a name that equals the **rowClick** value. 

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
		$scope.rowClickHandler = function (item, event) {
			alert("item: " + item);
		}
	})
</pre>

#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>