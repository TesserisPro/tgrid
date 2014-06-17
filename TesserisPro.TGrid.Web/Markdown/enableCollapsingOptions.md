####enableCollapsing

Enables or disables groups collapsing by click on group header.

**Value:** *true* or *false*. 

**Default value:** *false*


[enableCollapsing in Grid Settings](#!/GridSettings/enableCollapsing)

Example of dynamic change **enableCollapsing** grid setting:

#####For Knockout
In HTML you should define **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enableCollapsing**
can be changed using function 'enableCollapsing'.

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
In HTML you should define **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enableCollapsing**
can be changed using function 'enableCollapsing'.

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