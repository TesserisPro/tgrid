##TGrid column properties

Column properies can be defined in column template to customize column behavior. Below is an example of column property.

	<column data-g-member="Name"> </column>

Where *Name* is value of property **data-g-member**

**data-g-member** is only one **required** column property. If you will not define his property column will will show no data.

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
Javascript array of items.

	var items = [
        { Name: "John", Surname: "Doe", Age: "33 years 6 month", AgeGroup: "33" }
		{ Name: "Angela", Surname: "Smith", Age: "33 years 3 month", AgeGroup: "33" }
        //... more items
	];

###data-g-not-sized

Defines if column has width. If is set to *true*:

+ column doesn't have width

+ column becomes not resizable

+ table css property *table-layout* is set to *fixed*

+ width of all not-sized columns becomes the same and depends on table width.

###data-g-resizable

Defines if column is resizable. If property **data-g-not-sized** value is set to true, column will not be resizable.

**Value:** *false* or *true*.

**Default value:** *true*.

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
    
###data-g-views

Defines when to display column in mobile, desktop or all modes. 

**Value:** *mobile* or *desktop* or *mobile,desktop*.

**Default value:** *mobile,desktop*.

###data-g-width

Defines column width in pixels.

**Value:** Any positive value.

**Default value:** *150*

###data-g-width-percent

Defines column width in percent. Defines column width in percent. If **data-g-width-percent** is set, and **data-g-width** property is set, then **data-g-width-percent** is used to determine column width.

**Value:** From 1 to 100.

**Default value:** *null*


 
