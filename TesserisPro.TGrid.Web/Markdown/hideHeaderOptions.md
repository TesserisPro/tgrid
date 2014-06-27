####hideHeader

You can choose do not render the grid header. If it is set to *true*,the grid header isn't rendered.

**Value:** *true* or *false*

**Default value:** *false*

Example of a dynamic change the **hideHeader** grid setting:

#####For Knockout
In HTML you should define an **options** setting:
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in the knockout view model you should have an observable variable with the name equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **hideHeader**
can be changed using the function 'hideHeader'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.hideHeader = function () {
        self.gridOptions().hideHeader = true;
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML you should define an **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in the angular controller you should have a variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **hideHeader**
can be changed using the function 'hideHeader'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.hideHeader = function () {
            $scope.gridOptions.hideHeader = true;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####


<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>