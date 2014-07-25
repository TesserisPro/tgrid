##TGrid column properties

Column properies can be defined in column template to customize column behavior. Below is an example of column property.

	<column data-g-member="Name"> </column>

Where *Name* is value of property **data-g-member**

**data-g-member** is only one **required** column property. If you will not define his property column will will show no data.

###data-g-member

Sets the property name of the item in the data source items' array, which value should be displayed in the cell in the current column.
    
**Value:** The item's property name, which value will be used for this grid column.

**Default value:** there is no default value. 	

**Example:**

	<column data-g-member="Name"> </column>
    
A JavaScript array of items, where the every array element is a JavaScript object with the "Name" field. 
The "Name" field value is displayed in grid row in the column where the  **data-g-member** is set to "Name"

	var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
	];

####data-g-enable-filtering

This property is used to disable filtering for this column.

**Value:** *true* or *false*.

**Default value:** *true*.


####data-g-enable-grouping

This property is used to disable sorting for this column.

**Value:** *true* or *false*.

**Default value:** *true*.


####data-g-enable-sorting

This property is used to disable sorting for this column.

**Value:** *true* or *false*.

**Default value:** *true*.


###data-g-filter-member

This property is used to define item's property for filtering.
		
**Value:** Defines item's  property name, which value will be used for filtering this grid.

**Default value:** property **data-g-member**.

**Example:**

	<column data-g-member="Name" data-g-filter-member = "NameLowCase"> </column>
    
Data source. 

	var items = [
        { Name: "John", Surname: "Doe", Age: "33", NameLowCase: "john" }
        //... more items
	];

    
###data-g-group-member

This property is used to define item's property for grouping. 

**Value:** Defines item's  property name, which value will be used for grouping this grid.

**Default value:** property **data-g-member**.
		
Example:

	<column data-g-member="Age" data-g-group-member = "AgeGroup"> </column>
JavaScript array of items.

	var items = [
        { Name: "John", Surname: "Doe", Age: "33 years 6 month", AgeGroup: "33" }
		{ Name: "Angela", Surname: "Smith", Age: "33 years 3 month", AgeGroup: "33" }
        //... more items
	];

###data-g-not-sized

Defines whether the column has a width. If it is set to *true*, then:

+ the column doesn't have a width

+ the column becomes not resizable

+ the table css property *table-layout* is set to *fixed*

+ a width of all not-sized columns becomes the same and depends on the table width

###data-g-resizable

Defines if the column is resizable. If the property **data-g-not-sized** value is set to true, the column will not be resizable.

**Value:** *false* or *true*.

**Default value:** *true*.

###data-g-sort-member

Defines item's property for sorting.
	
**Value:** Defines item's property name, which value will be used for sorting this column.
**Default value:** property **data-g-member**.
	
**Example:**

	<column data-g-member="ProductId" data-g-sort-member = "ProductIdSort"> </column>
JavaScript array of items.

	var items = [
        { ProductId: "#1-3", ProductName: "Noodle", ProductIdSort: "13"}
		{ ProductId: "#1/1", ProductName: "Bread", ProductIdSort: "11"}
        //... more items
	];
    
###data-g-views

Defines in which mode display the column: in mobile, desktop or all modes. 

**Value:** *mobile* or *desktop* or *mobile,desktop*.

**Default value:** *mobile,desktop*.

###data-g-width

Defines the column width in pixels or percent.

**Value:** Any positive number to define the width in pixels("150") or a positive number with a percent sign ("15%").

**Default value:** *150*


 
