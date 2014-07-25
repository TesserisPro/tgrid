###data-g-sort-member

Defines the item's property for sorting.
	
**Value:** Defines the item's property name, which value will be used for sorting this column.

**Default value:** property **data-g-member**.
	
**Example:**
<!--Start the highlighter-->
<pre class="brush: html">
	<column data-g-member="ProductId" data-g-sort-member = "ProductIdSort"> </column>
</pre>
#####
A JavaScript array of items.
<pre class="brush: js">
	var items = [
        { ProductId: "#1-3", ProductName: "Noodle", ProductIdSort: "13"}
		{ ProductId: "#1/1", ProductName: "Bread", ProductIdSort: "11"}
        //... more items
	];
</pre>
#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
