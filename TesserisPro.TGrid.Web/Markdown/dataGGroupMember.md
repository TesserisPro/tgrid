###data-g-group-member

This property is used to define item's property for grouping. 

**Value:** Defines item's  property name, which value will be used for grouping this grid.

**Default value:** property **data-g-member**.
		
Example:

	<column data-g-member="Age" data-g-group-member = "AgeGroup"> </column>
Javascript array of items.

	var items = [
        { Name: "John", Surname: "Doe", Age: "33 years 6 month", AgeGroup: "33" }
		{ Name: "Angela", Surname: "Smith", Age: "33 years 3 month", AgeGroup: "33" }
        //... more items
	];
