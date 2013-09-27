var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Scripts/typings/jquery/jquery.d.ts" />
    (function (TGrid) {
        (function (Framework) {
            Framework[Framework["Knockout"] = 0] = "Knockout";
            Framework[Framework["Angular"] = 1] = "Angular";
        })(TGrid.Framework || (TGrid.Framework = {}));
        var Framework = TGrid.Framework;

        var Template = (function () {
            function Template(prototype) {
                this.content = "";
                this.binding = "";
                this.innerBinding = "";
                this.content = prototype.innerHTML == null ? prototype.innerText : prototype.innerHTML;
                if (prototype.firstElementChild != null && prototype.firstElementChild.hasAttribute("data-bind")) {
                    this.innerBinding = prototype.firstElementChild.getAttribute("data-bind");
                } else {
                    this.binding = prototype.getAttribute("data-bind");
                }
            }
            Template.prototype.GetBinding = function () {
                return this.binding != "" ? this.binding : this.innerBinding;
            };

            Template.prototype.applyKnockout = function (element) {
                element.innerHTML = this.content != null ? this.content : "";
                if (this.binding != null && this.binding.length > 0) {
                    element.setAttribute("data-bind", this.binding);
                }
            };

            Template.prototype.applyAngular = function (element, prefix) {
                element.innerHTML = this.content != null ? this.content : "";
                if (this.binding != null && this.binding.length > 0) {
                    element.innerHTML = "{{" + prefix + this.binding.split(':')[1].trim() + "}}";
                }
                if (this.innerBinding != null && this.innerBinding.length > 0) {
                    if (element.innerHTML != "") {
                        element.innerHTML = element.innerHTML.replace(this.innerBinding, "");
                        element.innerHTML = element.innerHTML.replace("</", "{{" + prefix + this.innerBinding.split(':')[1].trim() + "}}</");
                    } else {
                        element.innerHTML = "{{" + prefix + this.binding.split(':')[1].trim() + "}}";
                    }
                }
            };
            return Template;
        })();
        TGrid.Template = Template;

        var Options = (function () {
            function Options(element, framework) {
                this.columnHeaders = [];
                this.columnDataField = [];
                this.columnWidth = [];
                this.columnDevice = [];
                this.target = element;
                this.framework = framework;

                if (this.framework == Framework.Knockout) {
                    this.initializeKnockout();
                }
                if (this.framework == Framework.Angular) {
                    this.initializeAngular();
                }
            }
            Options.prototype.initializeKnockout = function () {
                this.mainBinding = this.target.attr("data-bind");

                if (this.mainBinding == undefined) {
                    this.mainBinding = "";
                }

                var text = this.target.find("script")[0].innerHTML;
                var optionsElement = $("<div>" + text + "</div");

                // Headers
                var headers = optionsElement.find("header");
                for (var i = 0; i < headers.length; i++) {
                    var template = new Template(headers[i]);
                    this.columnHeaders.push(template);
                }

                // Cells
                var cells = optionsElement.find("cell");
                for (var i = 0; i < cells.length; i++) {
                    var cell = new Template(cells[i]);
                    this.columnDataField.push(cell);
                }

                // Columns width
                var columns = optionsElement.find("column");
                for (var i = 0; i < columns.length; i++) {
                    this.columnWidth.push(columns[i].attributes['data-g-width'].nodeValue);
                    this.columnDevice.push(columns[i].attributes['data-g-views'].nodeValue);
                }
            };

            Options.prototype.initializeAngular = function () {
                this.mainBinding = this.target.attr("data-bind");

                if (this.mainBinding == undefined) {
                    this.mainBinding = "";
                }

                var text = this.target.find("script")[0].innerHTML;
                var optionsElement = $("<div>" + text + "</div");

                // Headers
                var headers = optionsElement.find("header");
                for (var i = 0; i < headers.length; i++) {
                    var template = new Template(headers[i]);
                    this.columnHeaders.push(template);
                }

                // Cells
                var cells = optionsElement.find("cell");
                for (var i = 0; i < cells.length; i++) {
                    var cell = new Template(cells[i]);
                    this.columnDataField.push(cell);
                }

                // Columns width
                var columns = optionsElement.find("column");
                for (var i = 0; i < columns.length; i++) {
                    this.columnWidth.push(columns[i].attributes['data-g-width'].nodeValue);
                    this.columnDevice.push(columns[i].attributes['data-g-views'].nodeValue);
                }
            };
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
