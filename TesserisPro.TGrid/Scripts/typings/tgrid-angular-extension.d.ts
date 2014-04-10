declare module ng {
    interface IModule {
        _invokeQueue: Array<any>;
    }
    interface IAugmentedJQueryStatic extends JQueryStatic {
        injector(): any;
    }
    interface IScope {
        items: Array<TesserisPro.TGrid.AngularItemViewModel>;
        options: TesserisPro.TGrid.Options;
    }
}
interface HTMLElement{
    injector(): any;
}
