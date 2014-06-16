####enablePaging

Enables or disables paging. 

**Value:** *true* or *false*.

**Default value:** *false*.

[enablePaging in Grid Settings](#!/GridSettings/enablePaging)

Example of dynamic change **enablePaging** grid setting:

#####For Knockout
In HTML define **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enablePaging**
can be changed using function 'enablePaging'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.enablePaging = function () {
        self.gridOptions().enablePaging = true;
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML define **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enablePaging**
can be changed using function 'enablePaging'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enablePaging = function () {
            $scope.gridOptions.enablePaging = true;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>