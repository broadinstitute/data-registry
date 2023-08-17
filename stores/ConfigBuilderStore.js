import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        rawFields: [],
        convertedFields: [],
        latestFieldRename: [null, null]
    }),
    getters: {
        getRawFields: (state) => state.rawFields,
        getConvertedFields: (state) => state.convertedFields,
        getLatestFieldRename: (state) => state.latestFieldRename
    },
    actions: {
        setRawFields(fields){
            this.rawFields = fields;
        },
        setConvertedFields(newFields){
            this.convertedFields = newFields;
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        }
    }
});