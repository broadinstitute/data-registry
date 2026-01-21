<script setup>
import { ref, computed, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useDatasetStore } from '~/stores/DatasetStore';

Chart.register(...registerables);

definePageMeta({
  layout: 'calr'
});

const store = useDatasetStore();

// State
const fileInput = ref(null);
const sessionId = ref(null);
const subjects = ref([]);
const loading = ref(false);
const processing = ref(false);
const error = ref(null);
const chartCanvas = ref(null);
const plotData = ref(null);
let chartInstance = null;

// Configuration
const selectedVariable = ref('ee');
const selectedSubjects = ref([]);
const aggregateBy = ref('hour');
const darkHour = ref(18);
const lightHour = ref(6);

// Options
const variables = [
  { value: 'vo2', label: 'Oxygen Consumption (ml/hr)' },
  { value: 'vco2', label: 'CO2 Production (ml/hr)' },
  { value: 'ee', label: 'Energy Expenditure (kcal/hr)' },
  { value: 'rer', label: 'Respiratory Exchange Ratio' },
  { value: 'feed', label: 'Food Intake (g)' },
  { value: 'drink', label: 'Water Intake (ml)' },
  { value: 'activity', label: 'Locomotor Activity (counts)' }
];

const aggregationOptions = [
  { value: 'raw', label: 'Raw (every reading)' },
  { value: 'hour', label: 'Hourly average' }
];

const subjectColors = [
  'rgb(59, 115, 199)', 'rgb(237, 95, 0)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)',
  'rgb(148, 103, 189)', 'rgb(140, 86, 75)', 'rgb(227, 119, 194)', 'rgb(127, 127, 127)'
];

// Handlers
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  error.value = null;

  try {
    const result = await store.uploadCalrFile(file);
    sessionId.value = result.session_id;
    subjects.value = result.subjects;
    selectedSubjects.value = [...result.subjects];

    await fetchAndRender();
  } catch (e) {
    error.value = e.response?.data?.detail || e.message;
  } finally {
    loading.value = false;
  }
}

async function fetchAndRender() {
  if (!sessionId.value || selectedSubjects.value.length === 0) {
    plotData.value = null;
    return;
  }

  processing.value = true;
  try {
    plotData.value = await store.processCalrData(
      sessionId.value,
      selectedSubjects.value,
      selectedVariable.value,
      aggregateBy.value,
      darkHour.value,
      lightHour.value
    );
    renderChart();
  } catch (e) {
    error.value = e.response?.data?.detail || e.message;
  } finally {
    processing.value = false;
  }
}

function renderChart() {
  if (!chartCanvas.value || !plotData.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  // Build datasets from backend response
  const datasets = plotData.value.traces.map((trace, i) => ({
    label: `Subject ${trace.subject_id}`,
    data: trace.x.map((x, j) => ({ x, y: trace.y[j] })),
    borderColor: subjectColors[i % subjectColors.length],
    backgroundColor: 'transparent',
    tension: 0.1,
    pointRadius: aggregateBy.value === 'raw' ? 1 : 3
  }));

  // Dark regions from backend
  const darkRegions = plotData.value.dark_regions || [];

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        title: { display: true, text: plotData.value.y_label, font: { size: 16 } },
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Experiment Hours' },
          min: 0,
          max: Math.max(...datasets.flatMap(d => d.data.map(p => p.x))) + 1
        },
        y: { title: { display: true, text: plotData.value.y_label } }
      }
    },
    plugins: [{
      id: 'darkRegions',
      beforeDraw: (chart) => {
        const { ctx, chartArea, scales: { x: xScale } } = chart;
        darkRegions.forEach(region => {
          const x0 = xScale.getPixelForValue(region.x0);
          const x1 = xScale.getPixelForValue(region.x1);
          ctx.save();
          ctx.fillStyle = 'rgba(128, 128, 128, 0.15)';
          ctx.fillRect(
            Math.max(x0, chartArea.left), chartArea.top,
            Math.min(x1, chartArea.right) - Math.max(x0, chartArea.left),
            chartArea.bottom - chartArea.top
          );
          ctx.restore();
        });
      }
    }]
  });
}

function resetAnalysis() {
  if (sessionId.value) {
    store.deleteCalrSession(sessionId.value).catch(() => {});
  }
  sessionId.value = null;
  subjects.value = [];
  selectedSubjects.value = [];
  plotData.value = null;
  error.value = null;
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  if (fileInput.value) fileInput.value.value = '';
}

// Re-fetch when config changes
watch([selectedVariable, selectedSubjects, aggregateBy, darkHour, lightHour], () => {
  if (sessionId.value) fetchAndRender();
});
</script>

<template>
  <div class="grid">
    <!-- Upload Section -->
    <div class="col-12">
      <Card>
        <template #title>
          <div class="flex align-items-center justify-content-between">
            <span>Upload Calorimetry Data</span>
            <Button v-if="sessionId" label="Reset" icon="bi-arrow-counterclockwise"
              severity="secondary" outlined size="small" @click="resetAnalysis" />
          </div>
        </template>
        <template #content>
          <div v-if="!sessionId" class="text-center">
            <p class="text-gray-600 mb-4">Upload a TSE, Oxymax, Sable, or CalR format CSV file.</p>
            <input ref="fileInput" type="file" accept=".csv" @change="handleFileUpload"
              class="hidden" id="calr-file-input" />
            <Button label="Select CSV File" icon="bi-upload" :loading="loading"
              @click="() => fileInput?.click()" />
          </div>
          <div v-else class="flex align-items-center gap-4">
            <Tag severity="success" icon="bi-check-circle">{{ subjects.length }} subjects loaded</Tag>
          </div>
          <Message v-if="error" severity="error" class="mt-4">{{ error }}</Message>
        </template>
      </Card>
    </div>

    <!-- Config Panel -->
    <div v-if="sessionId" class="col-12 lg:col-3">
      <Card>
        <template #title>Configuration</template>
        <template #content>
          <div class="flex flex-column gap-4">
            <div class="field">
              <label class="font-medium mb-2 block">Variable</label>
              <Dropdown v-model="selectedVariable" :options="variables"
                optionLabel="label" optionValue="value" class="w-full" />
            </div>

            <div class="field">
              <label class="font-medium mb-2 block">Aggregation</label>
              <Dropdown v-model="aggregateBy" :options="aggregationOptions"
                optionLabel="label" optionValue="value" class="w-full" />
            </div>

            <div class="field">
              <label class="font-medium mb-2 block">Subjects</label>
              <div class="flex flex-column gap-2 max-h-12rem overflow-y-auto">
                <div v-for="subject in subjects" :key="subject" class="flex align-items-center gap-2">
                  <Checkbox :inputId="`subject-${subject}`" :value="subject" v-model="selectedSubjects" />
                  <label :for="`subject-${subject}`">{{ subject }}</label>
                </div>
              </div>
              <div class="flex gap-2 mt-2">
                <Button label="All" size="small" outlined @click="selectedSubjects = [...subjects]" />
                <Button label="None" size="small" outlined @click="selectedSubjects = []" />
              </div>
            </div>

            <Divider />

            <div class="field">
              <label class="font-medium mb-2 block">Light Cycle</label>
              <div class="grid">
                <div class="col-6">
                  <label class="text-sm text-gray-600 block mb-1">Light</label>
                  <InputNumber v-model="lightHour" :min="0" :max="23" suffix="h" inputClass="w-full" class="w-full" />
                </div>
                <div class="col-6">
                  <label class="text-sm text-gray-600 block mb-1">Dark</label>
                  <InputNumber v-model="darkHour" :min="0" :max="23" suffix="h" inputClass="w-full" class="w-full" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Chart -->
    <div v-if="sessionId" class="col-12 lg:col-9">
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <span>Time Plot</span>
            <ProgressSpinner v-if="processing" style="width: 20px; height: 20px" />
          </div>
        </template>
        <template #content>
          <div v-if="selectedSubjects.length === 0" class="text-center py-8 text-gray-500">
            Select at least one subject to display the chart.
          </div>
          <div v-else class="chart-container" style="height: 500px;">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-if="!sessionId && !loading" class="col-12">
      <Card>
        <template #content>
          <div class="text-center py-8">
            <i class="bi bi-graph-up text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-gray-700 mb-2">No Data Loaded</h3>
            <p class="text-gray-500">Upload a calorimetry CSV file to begin.</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.hidden { display: none; }
.chart-container { position: relative; width: 100%; }
.max-h-12rem { max-height: 12rem; }
</style>
