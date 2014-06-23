//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// software and associated documentation files(the "Software"), to deal in the Software 
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
  
// 1. The above copyright notice and this permission notice shall be included in all 
//    copies or substantial portions of the Software.
//
// 2. Any software that fully or partially contains or uses materials covered by 
//    this license shall notify users about this notice and above copyright.The 
//    notification can be made in "About box" and / or site main web - page footer.The 
//    notification shall contain name of Tesseris Pro company and name of the Software 
//    covered by current license.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//=====================================================================================

module TesserisPro.TGrid {
    export class FilterDescriptor {
        path: string;
        value: string;
        caseSensetive: boolean;
        condition: FilterCondition;
        children: Array<FilterDescriptor>;
        parentChildUnionOperator: LogicalOperator;
        childrenUnionOperator: LogicalOperator;

        constructor(path: string, values: string, caseSensetive: boolean, condition: FilterCondition, parentChildOperator?: LogicalOperator, childOperator?: LogicalOperator, children?: Array<FilterDescriptor>) {
            this.path = path;
            this.value = values;
            this.caseSensetive = caseSensetive;
            this.condition = condition;
            this.children = children != undefined ? children : new Array<FilterDescriptor>();
            this.childrenUnionOperator = childOperator != undefined ? childOperator : LogicalOperator.And;
            this.parentChildUnionOperator = parentChildOperator != undefined ? parentChildOperator : LogicalOperator.And;
        }

        public addChild(filter: FilterDescriptor) {
            this.children.push(filter);
        }

        public removeChildByPath(path: string) {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].path == path) {
                    this.children.splice(i, 1);
                    return;
                }
            }
        }

        public static getEmpty(): FilterDescriptor
        {
            return new FilterDescriptor("", "", false, FilterCondition.Contains);
        }
    }
}