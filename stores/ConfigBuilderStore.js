import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        selectedColumns: [],
        convertedFields: [],
        latestFieldRename: [null, null],
    }),
    getters: {
        getRawFields: (state) => state.rawFields,
        getSelectedColumns: (state) => state.selectedColumns,
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
        setConvertedFields(newFields){
            this.convertedFields = newFields;
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        }
    }
});