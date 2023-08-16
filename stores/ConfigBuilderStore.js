import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        convertedFields: [],
        latestFieldRename: [null, null]
    }),
    getters: {
        getConvertedFields: (state) => state.convertedFields,
        getLatestFieldRename: (state) => state.latestFieldRename
    },
    actions: {
        setConvertedFields(newFields){
            this.convertedFields = newFields;
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        }
    }
});