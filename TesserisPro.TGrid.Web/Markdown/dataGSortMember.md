###data-g-sort-member

Defines item's property for sorting.
	
**Value:** Defines item's property name, which value will be used for sorting this column.

**Default value:** property **data-g-member**.
	
**Example:**

	<column data-g-member="ProductId" data-g-sort-member = "ProductIdSort"> </column>
Javascript array of items.

	var items = [
        { ProductId: "#1-3", ProductName: "Noodle", ProductIdSort: "13"}
		{ ProductId: "#1/1", ProductName: "Bread", ProductIdSort: "11"}
        //... more items
	];
