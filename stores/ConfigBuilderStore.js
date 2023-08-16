import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        fields: [],
        latestFieldRename: [null, null]
    }),
    getters: {
        getFields: (state) => state.fields,
        getLatestFieldRename: (state) => state.latestFieldRename
    },
    actions: {
        setFields(newFields){
            this.fields = newFields;
        },
        renameField(oldName, newName){
            this.latestFieldRename = [oldName, newName];
        }
    }
});