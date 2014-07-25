####ready

Sets a grid after loading handler function, which will be used in your sample view model to set actions after grid loading. The handler function has 1 parameter: an *options*. An *options* is an object of the TesserisPro.TGrid.Options type with initialized TGrid options inside.

In case Knockout: If the **ready** is defined, you should add  a function in your sample view model, with a name, which is the same as the **ready** value. If you don't do this, the exception "Unable to process binding" occurs. 

**Value:** any acceptable value for function name.

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
In JavaScript in a knockout view model you should have an observable variable with a name that equals the **ready** setting value. 

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
In JavaScript in an angular controller you should have a variable with a name that equals the **ready** setting value. 

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