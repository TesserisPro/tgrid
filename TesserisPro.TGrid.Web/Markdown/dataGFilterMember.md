###data-g-filter-member

This property is used to define item's property for filtering.
		
**Value:** Defines item's  property name, which value will be used for filtering this grid.

**Default value:** property **data-g-member**.

**Example:**
<!--Start the highlighter-->
<pre class="brush: html">
	<column data-g-member="Name" data-g-filter-member = "NameLowCase"> </column>
</pre>
##### 
Data source. 
<pre class="brush: js">
	var items = [
        { Name: "John", Surname: "Doe", Age: "33", NameLowCase: "john" }
        //... more items
	];
</pre>
#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>