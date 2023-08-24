import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        selectedColumns: [],
        latestColumnRename: [null, null],
        convertedFields: [],
        convertedFieldsConfig: [],
        unConvertedFieldsConfig: [],
        latestFieldRename: [null, null],
    }),
    getters: {
        getRawFields: (state) => state.rawFields,
        getSelectedColumns: (state) => state.selectedColumns,
        getColumnName: (state) => { return (rawField) => {
            let index = state.selectedColumns.map(column => column[0]).indexOf(rawField);
            return state.selectedColumns[index][1];
        }},
        getConvertedFieldsConfig: (state) => state.convertedFieldsConfig,
        getUnConvertedFieldsConfig: (state) => state.unConvertedFieldsConfig,
        getAllFields: (state) => state.unConvertedFieldsConfig.map(field => field["field name"]).concat(state.convertedFields),
        getAllFieldsConfig: (state) => state.unConvertedFieldsConfig.concat(state.convertedFieldsConfig),
        getLatestFieldRename: (state) => state.latestFieldRename,
        getLatestColumnRename: (state) => state.latestColumnRename,
    },
    actions: {
        setRawFields(fields){
            this.rawFields = fields;
        },
        addSelectedColumn(rawField){
            this.selectedColumns.push([rawField, rawField]);
            this.unConvertedFieldsConfig.push({
                "type": "raw",
                "field name": rawField,
                "raw field": rawField
            });
        },
        deleteSelectedColumn(rawField){
            let i = this.selectedColumns.map(item => item[0]).indexOf(rawField);
            this.selectedColumns.splice(i, 1);
            let j = this.unConvertedFieldsConfig.map(item => item["raw field"]).indexOf(rawField);
            this.unConvertedFieldsConfig.splice(j, 1);
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
        },
        setConvertedFields(newConvertedFields){
            let fieldNames = [];
            newConvertedFields.forEach(newField => {
                if (newField["type"] == "split"){
                    fieldNames = fieldNames.concat(newField["field name"]);
                } else {
                    fieldNames.push(newField["field name"]);
                }
                // Don't duplicate fields from the raw list if they're to be converted ultimately.
                if (!newField["create new"]){
                    let convertingField = newField["raw field"];
                    this.unConvertedFieldsConfig = this.unConvertedFieldsConfig.filter(
                        item => item["raw field"] != convertingField
                    );
                }
            });
            this.convertedFields = fieldNames;
            this.convertedFieldsConfig = newConvertedFields;
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
        }
    }
});