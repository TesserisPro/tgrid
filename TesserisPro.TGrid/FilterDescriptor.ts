module TesserisPro.TGrid {
    export class FilterDescriptor {
        column: string;
        value: string;
        condition: FilerCondition;
        constructor(column, values, condition) {
            this.column = column;
            this.value = values;
            this.condition = condition;
        }
    }
}