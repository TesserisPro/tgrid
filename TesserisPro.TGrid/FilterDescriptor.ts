module TesserisPro.TGrid {
    export class FilterDescriptor {
        path: string;
        value: string;
        condition: FilterCondition;
        children: Array<FilterDescriptor>;
        operation: FilterOperation;
        constructor(path: string, values: string, condition: FilterCondition, operation?: FilterOperation, children?: Array<FilterDescriptor>) {
            this.path = path;
            this.value = values;
            this.condition = condition;
            this.children = children != undefined ? children : new Array<FilterDescriptor>();
            this.operation = operation != undefined ? operation : FilterOperation.And;
        }
    }
}