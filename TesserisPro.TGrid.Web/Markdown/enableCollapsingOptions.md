####enableCollapsing

Enables or disables groups collapsing by click on a group header.

**Value:** *true* or *false*. 

**Default value:** *false*

[enableCollapsing in Grid Settings](#!/GridSettings/enableCollapsing)

Example of a dynamic change **enableCollapsing** grid setting:

#####For Knockout
In HTML you should define the **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in the knockout view model you should have the observable variable with name equals the **options** setting value. 
You can change grid options dynamically after grid loading. In the example below the grid setting **enableCollapsing**
can be changed using the function 'enableCollapsing'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.enableCollapsing = function () {
        self.gridOptions().enableCollapsing = true;
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML you should define the **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in the angular controller you should have the variable with name equals the **options** setting value. 
You can change grid options dynamically after grid loading. In example below the grid setting **enableCollapsing**
can be changed using the function 'enableCollapsing'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enableCollapsing = function () {
            $scope.gridOptions.enableCollapsing = true;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>