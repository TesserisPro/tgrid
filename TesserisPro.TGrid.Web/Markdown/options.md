####options

Defines a variable name for accessing the grid options from  a knockout/angular view model.TGrid properties and TGrid column properties can be changed dynamically, TGrid columns can be changed, added/removed.
After changing the options you should call the applyHandler() for the options.
#####For Knockout
<!--Start the highlighter-->
<pre class="brush:js">
    self.gridOptions().applyHandler();
</pre>
#####For Angular
<pre class="brush:js">
    $scope.gridOptions.applyHandler();
</pre>

**Value:** any acceptable name for variable.

**Default value:** doesn't have a default value.

**Example:**

#####For Knockout
In HTML you should define the **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in a knockout view model you should have an observable variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **enableSorting**
can be changed using the function 'enableSorting'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.enableSorting = function () {
        self.gridOptions().enableSorting = true;
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML you should define the **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in an angular controller you should have a variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **enableSorting**
can be changed using the function 'enableSorting'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enableSorting = function () {
            $scope.gridOptions.enableSorting = true;
            $scope.gridOptions.applyHandler();
		}
	}
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>