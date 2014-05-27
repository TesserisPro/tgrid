###data-g-member

Describes what property in data should be displayed in current column and element in items provider.
    
**Value:** item's  property name, which value will be used for this grid column.

**Default value:** there is no default value. 	

**Example:**

	<column data-g-member="Name"> </column>
    
Javascript array of items, where every array element is javascript object with "Name" filed refferenced in column.

	var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
	];
