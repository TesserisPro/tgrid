####itemsProvider
    
Defines an items provider for the grid.

**Value:** JavaScript object that contains the items provider function.

The simplest technique is to use the provided ArrayItemsProvider:

<pre class="brush: js">
    var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
    ];

    function vm() {
        var self = this;
        self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    };
</pre>
####  
Another provided itemsProvider is the ServerItemsProvider.

For more complex requirements you can create your own custom itemsProvider.  
You have two alternate interfaces to choose from:  

1. Implement the getItems & getTotalItemsCount methods.  
   See Demo "Custom Items Provider".

2. Implement the getItemsAndTotalCount method.  
   More suited to returning server data, this interface ties the items & totalCount data together 
   and reduces the server calls TGrid makes. See Demo "Get Items calls".


**Default value:** there isn't any default value.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
