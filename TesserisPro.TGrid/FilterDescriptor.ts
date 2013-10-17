module TesserisPro.TGrid {
    export class FilterDescriptor {
        column: string;
        value: string;
        condition: FilterCondition;
        constructor(column, values, condition) {
            this.column = column;
            this.value = values;
            this.condition = condition;
        }
    }
}