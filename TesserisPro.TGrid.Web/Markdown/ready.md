####ready

Sets grid after loading handler function, which will be used in your sample view model to set actions after grid loading. Handler function has 1 parameter: *options*. *options* is an object of TesserisPro.TGrid.Options type with initialized TGrid options inside.

In case Knockout: If **ready** is defined, you should add function in your sample view model, with name, which is the same as **ready** value. If you don't do this, the exception "Unable to process binding" occurs. 

**Value:** any acceptable for function name.

**Default value:** don't have default value.