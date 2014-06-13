####enableGrouping

Enables or disables Grouping for grid. 

**Value:** *true* or *false*.

**Default value:** *false*.

[enableGrouping in Grid Settings](#!/GridSettings/enableGrouping)

Example of dynamic change **enableGrouping** grid setting:

#####For Knockout
In HTML define **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enableGrouping**
can be changed using function 'enableGrouping'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.enableGrouping = function () {
        self.gridOptions().enableGrouping = true;
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML define **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enableGrouping**
can be changed using function 'enableGrouping'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enableGrouping = function () {
            $scope.gridOptions.enableGrouping = true;
            $scope.gridOptions.applyHandler();
		}
	}
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>