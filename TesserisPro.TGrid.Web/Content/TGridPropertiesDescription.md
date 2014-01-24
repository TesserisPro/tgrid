##TGrid properties

Many TGrid properties has default values and are not required in template. If property is not defined in TGrid template, default property value is applied instead automatically.

There is 1 required TGrid property:

1. ####itemsProvider

    Value: the name of items provider

    Default value: there is not default value.

Next properties are not requiered. If they are not defined, default value is used automatically.

1. ####enableCollapsing.
    Enables or disables groups collapsing, if property "**enableGrouping**" is set to *true*.

    Value: *true* or *false*. 

    Default value: *false*

    Dependings on another properties: Is used only with property *enableGrouping*.
2. ####enableFiltering.
    Enables or disables filtering.

    Value: *true* or *false*.

    Default value: *false*.
3. ####enableGrouping.
    Enables or disables grouping.

    Value: *true* or *false*.

    Default value: *false*.
4. ####enablePaging.
    Enables or disables paging.

    Value: *true* or *false*.

    Default value: *false*.
5. ####enableSorting.
    Enables or disables sorting.

    Value: *true* or *false*.

    Default value: *false*.
6. ####enableVirtualScroll.
    Enables or disables virtual scrolling.

    Value: *true* or *false*.

    Default value: *false*.
7. ####pageSize.

    Defines how many items are displayed on 1 page.

    Value: number from 1 to  total items count.

    Default value: *10*.
8. ####pageSlide.

    Property for page navigation. 
    Sets how many pages to left and to right you can be able to navigate by one click on its number.

    Value: number from 1 to  total items count.

    Default value: *10*.
9. ####selectionMode.

    Defines how many items can be selected in TGrid.

    Value: 
    + "none" - you can't select any item,
 
    + "single" - you can select only one item, 

    + "multi" - you can select more, then one item. For selecting more then one item, press key 'Ctrl'.

    Default value: *single*.
10. ####showDetailsOnSelection.

    Defines will or won't be shown details on selection. 

    Value: *true* or *false*.

    Default value: *false*.

    Dependings on another properties: is used, when property **selectionMode** has value *single*(default) or *multi*. If property **selectionMode** is *none*, property  **showDetailsOnSelection** is useless.
    
    For showing details on selection you should define html details template in TGrid description. 