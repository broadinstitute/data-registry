import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        selectedColumns: [],
        columnObject: {},
        columnNameChange: [null, null],
        convertedFields: [],
        dataConvert: [],
        latestFieldRename: [null, null],
    }),
    getters: {
        getRawFields: (state) => state.rawFields,
        getSelectedColumns: (state) => state.selectedColumns,
        getColumnObject: (state) => state.columnObject,
        getConvertedFields: (state) => state.convertedFields,
        getDataConvert: (state) => state.dataConvert,
        getLatestFieldRename: (state) => state.latestFieldRename
    },
    actions: {
        setRawFields(fields){
            this.rawFields = fields;
        },
        setSelectedColumns(columns){
            this.selectedColumns = columns;
        },
        setColumnObject(newColumnObject){
            this.columnObject = newColumnObject;
        },
        setColumnNameChange(nameChange){
            this.columnNameChange = nameChange;
        },
        setConvertedFields(newFields){
            this.convertedFields = newFields;
        },
        setDataConvert(newDataConvert){
            this.dataConvert = newDataConvert;
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        }
    }
});