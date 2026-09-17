<script setup>
import { computed } from 'vue';
import { flattenReport, reportSummary } from '~/utils/pegValidationReport';

const props = defineProps({
  report: { type: Object, required: true },
});

const sections = computed(() => flattenReport(props.report));
const summary = computed(() => reportSummary(props.report));
const overall = computed(() => (props.report?.status === 'error' ? 'error' : 'success'));

const severityFor = (status) => ({ error: 'danger', warning: 'warning', ok: 'success' }[status] || 'info');
const chipLabel = (status) => ({ error: 'Errors', warning: 'Warnings', ok: 'OK' }[status] || status);
</script>

<template>
  <div class="peg-report" :data-status="overall">
    <Message :severity="overall === 'error' ? 'error' : 'success'" :closable="false" class="mb-3">
      <span v-if="overall === 'error'">Your files did not pass validation. Fix the errors below and try again.</span>
      <span v-else>Your files passed validation.</span>
      <span class="ml-2 text-sm">({{ summary }})</span>
    </Message>

    <div v-for="section in sections" :key="section.key" class="peg-report-section mb-3 p-3 border-round surface-50">
      <div class="flex align-items-center gap-2 mb-2">
        <Tag :severity="severityFor(section.status)" :value="chipLabel(section.status)" />
        <span class="font-semibold">{{ section.label }}</span>
        <span v-if="section.fileName" class="text-gray-600 text-sm">{{ section.fileName }}</span>
      </div>

      <div v-for="(entry, i) in section.entries" :key="i" class="peg-entry mb-2 pl-2" :class="`peg-entry-${entry.level}`">
        <div><span class="font-medium">{{ entry.step }}</span><span v-if="entry.step && entry.message">: </span>{{ entry.message }}</div>
        <div v-if="entry.line" class="text-sm pl-3">{{ entry.line }}</div>
        <ul v-if="entry.rowErrors.length" class="text-sm pl-4 mt-1 mb-0">
          <li v-for="(r, j) in entry.rowErrors" :key="j">{{ r }}</li>
        </ul>
        <table v-if="entry.columnErrors.length" class="peg-column-table text-sm mt-1">
          <thead><tr><th>Column</th><th>Check</th><th>Rows</th><th>Hint</th></tr></thead>
          <tbody>
            <tr v-for="(c, j) in entry.columnErrors" :key="j">
              <td>{{ c.column }}</td><td><code>{{ c.check }}</code></td><td>{{ c.rows }}</td><td>{{ c.hint }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <details v-if="section.infoCount" class="text-sm text-gray-600 mt-1">
        <summary>{{ section.infoCount }} check{{ section.infoCount === 1 ? '' : 's' }} passed</summary>
        <ul class="pl-4 mb-0">
          <li v-for="(entry, i) in section.info" :key="i">{{ entry.step }}: {{ entry.message }}</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<style scoped>
.peg-entry-error { border-left: 3px solid #ef4444; }
.peg-entry-warning { border-left: 3px solid #f59e0b; }
.peg-column-table { border-collapse: collapse; width: 100%; }
.peg-column-table th, .peg-column-table td { text-align: left; padding: 0.25rem 0.5rem; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
.peg-column-table code { word-break: break-all; }
</style>
