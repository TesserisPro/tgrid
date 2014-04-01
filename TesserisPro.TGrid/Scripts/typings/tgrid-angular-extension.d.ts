declare module ng {
    interface IModule {
        _invokeQueue: Array<any>;
    }
    interface IAugmentedJQueryStatic extends JQueryStatic {
        injector(): any;
    }
}
interface HTMLElement{
    injector(): any;
}
