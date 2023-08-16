import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
    state: () => ({
        fields: []
    }),
    getters: {
        getFields: (state) => state.fields,
    },
    actions: {
        setFields(newFields){
            this.fields = newFields;
        }
    }
});