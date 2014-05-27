///<reference path="knockout.d.ts"/>
declare module routing {
    class HashService {
        private prevHash;
        private preventNextEvent;
        private storedHash;
        private legalHash;
        private pending;
        private cancellingPrev;
        private callCount;
        private forwardingCount;
        public hash: string;
        public on_changing: (hash: string, callback: (cancelNavigation: boolean) => void) => void;
        public on_changed: (hash: string) => void;
        public on_cancelledByUrl: () => void;
        public setHash(hash: any): void;
        public setHashAsReplace(hash: any): void;
        public start(): void;
        private lock();
        private release();
        private changingCallback(cancelNavigation);
        private hashChanged(newHash);
        private onHashChangedEventHandler();
    }
}
declare module routing {
    interface ILogger {
        warning(message: string): void;
        error(message: string): void;
        info(message: string): void;
    }
    class DefaultRouterLogger implements ILogger {
        public warning(message: string): void;
        public error(message: string): void;
        public info(message: string): void;
        private write(message);
    }
    class SilentLogger {
        public warning(message: string): void;
        public error(message: string): void;
        public info(message: string): void;
    }
}
declare module routing.routes {
    interface RouteOptions {
        parrentRoute?: string;
        isDefault?: boolean;
        canLeave?: (callback: (allow: boolean) => void, navOptions: any) => void;
    }
    class Route {
        public pattern: string;
        public parrentRoute: Route;
        public isDefault: boolean;
        public canLeave: (callback: (allow: boolean) => void, navOptions: any) => void;
        constructor(routePattern: string, options: RouteOptions);
    }
    class VirtualRoute extends Route {
        public childRoutes: Route[];
        constructor(routePattern: string, childRoutes: Route[], options: RouteOptions);
    }
    enum LoadingState {
        canceled = 0,
        complete = 1,
        loading = 2,
    }
    interface NavigationRouteOptions extends RouteOptions {
        currentVM?: any;
        cacheView?: boolean;
        vmFactory?: any;
        title?: string;
        toolbarId?: string;
    }
    interface NavigationInfo {
        targetRoute: Route;
        forceReloadOnNavigation: boolean;
        forceNavigationInCache: boolean;
    }
    interface INavigationAware {
        onNavigatedTo?: (params: any, payload?: any) => void;
        canNavigateFrom?: (callback: any, navOptions: NavigationInfo) => void;
        onNavigatedFrom?: (newNavOptions: NavigationInfo) => void;
    }
    class NavigationRoute extends Route {
        public viewPath: string;
        public currentVM: INavigationAware;
        public cacheView: boolean;
        public onNavigatedTo: (params: any, payload?: any) => void;
        public onNavigatedFrom: () => void;
        public vmFactory: any;
        public title: string;
        public toolbarId: string;
        public state: LoadingState;
        constructor(routePattern: string, viewPath: string, options: NavigationRouteOptions);
    }
}
declare module routing.utils {
    function getType(obj: any): string;
    function getHash(path: any): string;
}
declare module routing {
    interface INavigationContext {
        associeatedRoute: routes.Route;
        path: string;
        params?: any;
    }
    interface IRouterInitOptions {
        beforeNavigationHandler?: () => void;
        afterNavigationHandler?: () => void;
        navigationErrorHandler?: () => void;
        enableLogging?: boolean;
    }
    class Router {
        public initialized: boolean;
        public routes: routes.Route[];
        public currentRoute: KnockoutObservable<routes.Route>;
        public history: string[];
        private hashSymbol;
        private defaultPath;
        private currentHash;
        private startupUrl;
        private containerId;
        private defaultTitle;
        private defaultRoute;
        private fresh;
        private allRoutes;
        private handlers;
        private hashService;
        private currentLogger;
        private currentPayload;
        private navigationFlags;
        private forceReloadOnNavigation;
        private forceNavigationInCache;
        private forceCaching;
        private backNavigation;
        private isRedirecting;
        private preventRaisingNavigateTo;
        private beforeNavigationHandler;
        private afterNavigationHandler;
        private navigationErrorHandler;
        private cancelledByUrlHandler;
        constructor(mainContainerId: string, options?: IRouterInitOptions, routesToMap?: routes.Route[]);
        public navigateTo(path: string, options?: any): void;
        public navigateBack(): void;
        public navigateBackInCache(): void;
        public navigateHome(): void;
        public getHashSymbol(): string;
        public cancelledByUrl(handler: any): void;
        public refreshCurrentRoute(): void;
        public registerRoute(routeToMap: routes.Route): Router;
        public registerRoutes: (routesToMap: routes.Route[]) => void;
        public setLogger(logger: ILogger): Router;
        public init: (routes: any, mainContainerId: any, options: any) => any;
        public run(): Router;
        public getRoute(routeLink: string): routes.Route;
        public isMatches(path1: string, path2: string): boolean;
        public isMatchesV2(path1: string, path2: string): boolean;
        private cleanPath(path);
        private getPathForRoute(route);
        private getCompletePath(path, params);
        private fixPath(path);
        private createCurrentRoute();
        private raiseOnNavigatedTo(route, context);
        private getContext(route, hash);
        private hashChanginHandler;
        private hashChangedHandler;
        private hashChangeCancelledHandler;
        private mapVirtualRoute(routeToMap);
        private mapNavigationRoute(routeToMap);
        private initRoute(routeToMap);
    }
}
interface KnockoutBindingHandlers {
    navigate: KnockoutBindingHandler;
    navigateBack: KnockoutBindingHandler;
}
declare module routing.knockout {
    function setCurrentRouter(router: Router): void;
}
