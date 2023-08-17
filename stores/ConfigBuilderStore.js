import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        selectedColumns: [],
        columnObject: {},
        convertedFields: [],
        latestFieldRename: [null, null],
    }),
    getters: {
        getRawFields: (state) => state.rawFields,
        getSelectedColumns: (state) => state.selectedColumns,
        getColumnObject: (state) => state.columnObject,
        getConvertedFields: (state) => state.convertedFields,
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
        setConvertedFields(newFields){
            this.convertedFields = newFields;
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        }
    }
});