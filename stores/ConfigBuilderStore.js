import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        selectedColumns: {},
        latestColumnRename: [null, null],
        convertedFields: [],
        convertedFieldsConfig: [],
        unConvertedFieldsConfig: [],
        latestFieldRename: [null, null],
    }),
    getters: {
        getRawFields: (state) => state.rawFields,
        getSelectedColumns: (state) => state.selectedColumns,
        getConvertedFieldsConfig: (state) => state.convertedFieldsConfig,
        getUnConvertedFieldsConfig: (state) => state.unConvertedFieldsConfig,
        getAllFields: (state) => state.unConvertedFieldsConfig.map(field => field["field name"]).concat(state.convertedFields),
        getAllFieldsConfig: (state) => state.unConvertedFieldsConfig.concat(state.convertedFieldsConfig),
        getLatestFieldRename: (state) => state.latestFieldRename,
        getLatestColumnRename: (state) => state.latestColumnRename
    },
    actions: {
        setRawFields(fields){
            this.rawFields = fields;
        },
        setSelectedColumns(columns){
            // TODO overhaul column select to add columns one by one
            let columnKeys = Object.keys(columns);
            let rawFieldItems = [];
            columnKeys.forEach(columnKey => {
                let fieldAlreadyConverted = false;
                for (let i = 0; i < this.convertedFieldsConfig.length; i++){
                    let fieldConfig = this.convertedFieldsConfig[i];
                    if (!!fieldConfig["raw field"] && fieldConfig["raw field"] == columnKey && !fieldConfig["create new"]){
                        fieldAlreadyConverted = true;
                        console.log(`Field ${columnKey} has been converted`);
                    }
                }
                if (!fieldAlreadyConverted){
                    let rawFieldItem = {
                        "type": "raw",
                        "field name": columns[columnKey],
                        "raw field": columnKey
                    };
                    rawFieldItems.push(rawFieldItem);
                }
            });
            this.unConvertedFieldsConfig = rawFieldItems;
            this.selectedColumns = columns;
        },
        renameColumn(rawField, newName){
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
                "field name": this.selectedColumns[rawField],
                "raw field": rawField
            }
            this.unConvertedFieldsConfig.push(unConverted);
        }
    }
});