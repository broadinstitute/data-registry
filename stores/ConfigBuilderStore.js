import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        selectedColumns: [],
        latestColumnRename: [null, null],
        convertedFieldsConfig: [],
        unConvertedFieldsConfig: [],
        allFields: [],
        allFieldsConfig: [],
        latestFieldRename: [null, null],
    }),
    getters: {
        getColumnName: (state) => { return (rawField) => {
            let index = state.selectedColumns.map(column => column[0]).indexOf(rawField);
            return state.selectedColumns[index][1];
        }},
    },
    actions: {
        setRawFields(fields){
            this.rawFields = fields;
        },
        updateAllFields(){
            const flattenFields = (a, b) => a.concat(b.type === "split" ? b["field name"] : [b["field name"]]);
            this.allFieldsConfig = this.unConvertedFieldsConfig.concat(this.convertedFieldsConfig);
            this.allFields = this.allFieldsConfig.reduce(flattenFields, []);
        },
        addSelectedColumn(rawField){
            this.selectedColumns.push([rawField, rawField]);
            this.unConvertedFieldsConfig.push({
                "type": "raw",
                "field name": rawField,
                "raw field": rawField
            });
            this.updateAllFields();
        },
        deleteSelectedColumn(rawField){
            let i = this.selectedColumns.map(item => item[0]).indexOf(rawField);
            this.selectedColumns.splice(i, 1);
            let j = this.unConvertedFieldsConfig.map(item => item["raw field"]).indexOf(rawField);
            this.unConvertedFieldsConfig.splice(j, 1);
            this.updateAllFields();
        },
        renameColumn(rawField, newName){
            for (let i = 0; i < this.selectedColumns.length; i++){
                let columnEntry = this.selectedColumns[i];
                if (columnEntry[0] == rawField){
                    this.selectedColumns[i] = [rawField, newName];
                }
            }
            for (let i = 0; i < this.unConvertedFieldsConfig.length; i++){
                let entry = this.unConvertedFieldsConfig[i];
                if (entry["raw field"] == rawField){
                    let updatedEntry = {
                        "type": "raw",
                        "field name": newName,
                        "raw field": rawField
                    }
                    this.unConvertedFieldsConfig[i] = updatedEntry; 
                }
            }
            this.latestColumnRename = [rawField, newName];
            this.updateAllFields();
        },
        setConvertedFields(newConvertedFields){
            newConvertedFields.forEach(newField => {
                // Don't duplicate fields from the raw list if they're to be converted ultimately.
                if (!newField["create new"]){
                    let convertingField = newField["raw field"];
                    this.unConvertedFieldsConfig = this.unConvertedFieldsConfig.filter(
                        item => item["raw field"] != convertingField
                    );
                }
            });
            this.convertedFieldsConfig = newConvertedFields;
            this.updateAllFields();
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        },
        restoreUnConverted(rawField){
            let unConverted = {
                "type": "raw",
                "field name": this.getColumnName(rawField),
                "raw field": rawField
            }
            this.unConvertedFieldsConfig.push(unConverted);
            this.updateAllFields();
        }
    }
});