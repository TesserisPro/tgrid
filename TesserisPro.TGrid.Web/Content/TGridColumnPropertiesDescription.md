
##TGrid column properties

These properies should be defined in column template. For example:

	<column data-g-member="Name"> </column>

Where *Name* is value of property **data-g-member**

There is one **required** column property:

1. ####data-g-member
    Binds column and element in items provider. In items provider should be defined items. For example:
			
    TGrid template:

		<column data-g-member="Name"> </column>
    Javascript array of items, where every array element is javascript object. Object's property name is column name, and property value is value of grid cell

		var items = [
         { Name: "John", Surname: "Doe", Age: "33" }
         //... more items
		];

    *Name* is column name. *John* will be displayed in table cell, in column *Name*, in first row.

    Value: item's  property name, which value will be used for this grid column.

    Default value: there is no default value. 
    Value of this property is

1. ####data-g-filter-member

    Default property value is value of **data-g-member**. This property is used to define item's property for filtering. Column can have values from one items property, but be filtered by another. 
    It can be needed if you don't want case sensitive filter, for example.(TGrid filter is case-sensitive)
		
    TGrid template:

		<column data-g-member="Name" data-g-filter-member = "NameLowCase"> </column>
    Javascript array of items, where every array element is javascript object. 

		var items = [
         { Name: "John", Surname: "Doe", Age: "33", NameLowCase: "john" }
         //... more items
		];

    Value: Defines item's  property name, which value will be used for filtering this grid.

    Default value: property **data-g-member**.
2. ####data-g-group-member

    Default property value is value of **data-g-member**. This property is used to define item's property for grouping. Column can have value from one item's property, but be grouping by another. 
    It can be needed if you don't want case sensitive filter, for example.(TGrid filter is case-sensitive)
		
    TGrid template:

		<column data-g-member="Age" data-g-group-member = "AgeGroup"> </column>
    Javascript array of items, where every array element is javascript object.

		var items = [
         { Name: "John", Surname: "Doe", Age: "33 years 6 month", AgeGroup: "33" }
		 { Name: "Angela", Surname: "Smith", Age: "33 years 3 month", AgeGroup: "33" }
         //... more items
		];

    Value: Defines item's  property name, which value will be used for grouping this grid.

    Default value: property **data-g-member**.

4. ####data-g-resizable

    Defines if column is resizable. 

    Value: *false* or *true*.

    Default value: *true*.

5. ####data-g-sort-member

    Default property value is value of **data-g-member**. This property is used to define item's property for sorting. Column can have value from one item's property, but be sorting by another. 
    Example:
		
    TGrid template:

		<column data-g-member="ProductId" data-g-sort-member = "ProductIdSort"> </column>
    Javascript array of items, where every array element is javascript object. **data-g-sort-member** defines, which object property value will be used for sorting.

		var items = [
         { ProductId: "#1-3", ProductName: "Noodle", ProductIdSort: "13"}
		 { ProductId: "#1/1", ProductName: "Bread", ProductIdSort: "11"}
         //... more items
		];

    Value: Defines item's property name, which value will be used for sorting this column.

    Default value: property **data-g-member**.

6. ####data-g-views

    Defines if column is displayed only on mobile devices or on desktop devices or on both. 

    Value: *mobile* or *desktop* or *mobile,desktop*.

    Default value: *mobile,desktop*.

7. ####data-g-width

    Defines column width in pixels.

    Value: Any positive value.

    Default value: *150*.