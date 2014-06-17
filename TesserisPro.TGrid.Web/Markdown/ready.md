####ready

Sets grid after loading handler function, which will be used in your sample view model to set actions after grid loading. Handler function has 1 parameter: *options*. *options* is an object of TesserisPro.TGrid.Options type with initialized TGrid options inside.

In case Knockout: If **ready** is defined, you should add function in your sample view model, with name, which is the same as **ready** value. If you don't do this, the exception "Unable to process binding" occurs. 

**Value:** any acceptable for function name.

**Default value:** doesn't have default value.

**Example:**

#####For Knockout
In HTML:
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, ready: gridReady}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **ready** value. 

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);

    self.gridReady = function (options) {
       alert("Grid is ready");
	}
}
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" ready="gridReady">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **ready** value. 

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
		$scope.gridReady = function (options) {
			alert("Grid is ready");
		}
	})
</pre>

#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>