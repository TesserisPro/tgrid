var DemoViewModel = (function (data) {

    var self = this;
    var isDesktop = true;

    self.demos = ko.observableArray(data.desktop);
    self.currentDemoItem = ko.observable(self.demos()[0]);
    self.currentDemo = ko.observable(self.demos()[0].url);

    self.demosmob = ko.observableArray(data.mobile);
    self.currentDemoMobItem = ko.observable(self.demosmob()[0]);

    self.currentDemoUrl = ko.computed(function () { return window.location.href + "?demo=" + self.currentDemo(); });

    self.currentDemoMobUrl = ko.computed(function () { return window.location.href + "?demo=" + self.currentDemo(); });

    self.openDemo = function (demoItem) {
        if (self.knockoutActive()) {
            self.currentDemo(demoItem.url);
        } else {
            self.currentDemo(demoItem.angularUrl);
        }
        self.currentDemoItem(demoItem);
        self.currentCodeName(self.codes()[0].name);
        isDesktop = true;
        UpdateCodePreview();
    }

    self.openDemoMob = function (demoItem) {
        if (self.knockoutActive()) {
            self.currentDemo(demoItem.url);
        } else {
            self.currentDemo(demoItem.angularUrl);
        }
        self.currentDemoMobItem(demoItem);
        self.currentDemoItem(demoItem);
        self.currentCodeName(self.codes()[0].name);
        isDesktop = false;
        UpdateCodePreview();
    }

    self.currentCode = ko.observable("");

    self.codes = ko.observableArray([
        { name: "HTML" },
        { name: "JS" }
    ]);

    self.currentCodeName = ko.observable(self.codes()[0].name);

    self.showCode = function (codeName) {
        self.currentCodeName(codeName.name);

        UpdateCodePreview();
    }

    function UpdateCodePreview() {
        if (self.knockoutActive()) {
            if (self.currentCodeName() == "HTML") {
                if (isDesktop) {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoItem().htmlUrl), function (r) { self.currentCode(r) })
                } else {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoMobItem().htmlUrl), function (r) { self.currentCode(r) })
                }
            }
            if (self.currentCodeName() == "CSS") {
                if (isDesktop) {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoItem().cssUrl), function (r) { self.currentCode(r) })
                } else {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoMobItem().cssUrl), function (r) { self.currentCode(r) })
                }
            }
            if (self.currentCodeName() == "JS") {
                if (isDesktop) {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoItem().jsUrl), function (r) { self.currentCode(r) })
                } else {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoMobItem().jsUrl), function (r) { self.currentCode(r) })
                }
            }
        } else {
            if (self.currentCodeName() == "HTML") {
                if (isDesktop) {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoItem().angularHtmlUrl), function (r) { self.currentCode(r) })
                } else {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoMobItem().angularHtmlUrl), function (r) { self.currentCode(r) })
                }
            }
            if (self.currentCodeName() == "CSS") {
                if (isDesktop) {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoItem().angularCssUrl), function (r) { self.currentCode(r) })
                } else {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoMobItem().angularCssUrl), function (r) { self.currentCode(r) })
                }
            }
            if (self.currentCodeName() == "JS") {
                if (isDesktop) {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoItem().angularJsUrl), function (r) { self.currentCode(r) })
                } else {
                    $.get(window.location.href.replace(new RegExp("/([^/])+(/(\0x3F.+)?)?$"), "/Code?code=" + self.currentDemoMobItem().angularJsUrl), function (r) { self.currentCode(r) })
                }
            }
        }
    }
    self.knockoutActive = ko.observable(true);
    self.setKnockoutActive = function () {
        if (!self.knockoutActive()) {
            self.knockoutActive(true);
            if (isDesktop) {
                self.openDemo(self.currentDemoItem());
            } else {
                self.openDemoMob(self.currentDemoMobItem());
            }
        }
    }
    self.setKnockoutInactive = function () {
        if (self.knockoutActive()) {
            self.knockoutActive(false);
            if (isDesktop) {
                self.openDemo(self.currentDemoItem());
            } else {
                self.openDemoMob(self.currentDemoMobItem());
            }
        }
    }
    UpdateCodePreview();
});


