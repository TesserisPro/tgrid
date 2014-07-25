####selectionMode

Defines how many items can be selected in the TGrid. If the **rowClick** is defined, it is set to  *'none'*.

**Value:**

+ "none" - you can't select any item
 
+ "single" - you can select only one item 

+ "multi" - you can select more, then one item. For selecting more then one item, press key 'Ctrl'

**Default value:** *single*.

[selectionMode in Grid Settings](#!/GridSettings/selectionMode)

Example of a dynamic change the **selectionMode** grid setting:

#####For Knockout
In HTML you should define the **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In JavaScript in a knockout view model you should have an observable variable with a name that equals the **options** value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **selectionMode**
can be changed using the function 'selectionMode'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.selectionMode = function () {
        self.gridOptions().selectionMode = "multi";
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
In JavaScript in an angular controller you should have a variable with a name that equals the **options** value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **selectionMode**
can be changed using the function 'selectionMode'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.selectionMode = function () {
            $scope.gridOptions.selectionMode = "multi";
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>