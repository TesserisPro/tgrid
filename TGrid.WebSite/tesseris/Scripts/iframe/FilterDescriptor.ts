module TesserisPro.TGrid {
    export class FilterDescriptor {
        path: string;
        value: string;
        condition: FilterCondition;
        constructor(path, values, condition) {
            this.path = path;
            this.value = values;
            this.condition = condition;
        }
    }
}