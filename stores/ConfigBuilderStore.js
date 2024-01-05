import { defineStore } from 'pinia';

export const useConfigBuilderStore = defineStore('ConfigBuilderStore', {
  state: () => ({
    rawFields: [],
    selectedColumns: [],
    latestColumnRename: [null, null],
    convertedFieldsConfig: [],
    allFields: [],
    allFieldsConfig: [],
    latestFieldRename: [null, null],
  }),
  getters: {
    getColumnName: (state) => {
      return (rawField) => {
        const index = state.getColumnIndex(rawField);
        return state.selectedColumns[index]["field name"];
      };
    },
    getColumnIndex: (state) => {
      return rawField =>
        state.selectedColumns.map(column => column["raw field"]).indexOf(rawField);
    },
    getUnConvertedFields: (state) => {
      return state.selectedColumns.filter(column => !column.converted);
    }
  },
  actions: {
    setRawFields (fields) {
      this.rawFields = fields;
    },
    updateAllFields () {
      const flattenFields = (a, b) => a.concat(b.type === "split" ? b["field name"] : [b["field name"]]);
      this.allFieldsConfig = this.getUnConvertedFields.concat(this.convertedFieldsConfig);
      this.allFields = this.allFieldsConfig.reduce(flattenFields, []);
    },
    addSelectedColumn (rawField) {
      // Don't add if already present
      if (this.getColumnIndex(rawField) !== -1) {
        return;
      }
      this.selectedColumns.push({
        type: "raw",
        "field name": rawField,
        "raw field": rawField,
        converted: false
      });
      this.updateAllFields();
    },
    deleteSelectedColumn (rawField) {
      this.selectedColumns = this.selectedColumns.filter(column => column["raw field"] !== rawField);
      this.updateAllFields();
    },
    renameColumn (rawField, newName) {
      const index = this.getColumnIndex(rawField);
      const columnEntry = this.selectedColumns[index];
      const oldName = columnEntry["field name"];
      columnEntry["field name"] = newName;
      this.selectedColumns[index] = columnEntry;
      this.latestColumnRename = [rawField, newName];
      if (!columnEntry.converted) {
        this.latestFieldRename = [oldName, newName];
      }
      this.updateAllFields();
    },
    setConvertedFields (newConvertedFields) {
      newConvertedFields.forEach((newField) => {
        // Don't duplicate fields from the raw list if they're to be converted ultimately.
        if (!newField["create new"]) {
          const convertingField = newField["raw field"];
          this.updateSelectedColumns(convertingField, "converted", true);
        }
      });
      this.convertedFieldsConfig = newConvertedFields;
      this.updateAllFields();
    },
    renameField (oldName, newName) {
      this.latestFieldRename = [oldName, newName];
    },
    restoreUnConverted (rawField) {
      this.updateSelectedColumns(rawField, "converted", false);
      this.updateAllFields();
    },
    updateSelectedColumns (rawField, attribute, value) {
      const index = this.getColumnIndex(rawField);
      const column = this.selectedColumns[index];
      column[attribute] = value;
      this.selectedColumns[index] = column;
    }
  }
});
