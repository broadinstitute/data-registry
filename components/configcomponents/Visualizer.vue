<template>
  <div class="card mdkp-card">
    <div class="row card-body dr-description-section">
      <div class="col-md-12">
        <h4>Visualizer</h4>
        <div class="row">
          <div class="col filter-col-md">
            <a href="https://hugeampkpncms.org/node/48" target="_blank" class="tutorial-link">
              Visualizer tutorial
            </a>
            <div class="row">
              <div class="col-md-12">
                <div class="row dr-builder-ui">
                  <div class="col-md-10 col">
                    <div>
                    <div class="label">
                      Select visualizer
                    </div>
                    <select v-model="vizType" id="viz-selector" class="form-control">
                      <option value="">
                        Select
                      </option>
                      <option v-for="viz in PLOT_TYPES" :key="viz.id" :value="viz.id">
                        {{ viz.display }}
                      </option>
                    </select>
                  </div>
                    <div class="label" v-if="vizType">
                      Set parameters
                    </div>
                    <Manhattan
                      v-if="vizType === PLOT_TYPES.MANHATTAN_PLOT.id"
                      :editing="editingVizType === PLOT_TYPES.MANHATTAN_PLOT.id"
                      :configToLoad = "currentConfig"
                      @update-visualizer="(newConfig, saveCheck) => getConfig(newConfig, saveCheck)"
                    />
                    <Heatmap
                      v-else-if="vizType === PLOT_TYPES.HEATMAP_PLOT.id"
                      :editing="editingVizType === PLOT_TYPES.HEATMAP_PLOT.id"
                      :configToLoad = "currentConfig"
                      @update-visualizer="(newConfig, saveCheck) => getConfig(newConfig, saveCheck)"
                    />
                    <Phewas
                      v-else-if="vizType === PLOT_TYPES.PHEWAS_PLOT.id"
                      :editing="editingVizType === PLOT_TYPES.PHEWAS_PLOT.id"
                      :configToLoad = "currentConfig"
                      @update-visualizer="(newConfig, saveCheck) => getConfig(newConfig, saveCheck)"
                    />
                    <Region
                      v-else-if="vizType === PLOT_TYPES.REGION_PLOT.id"
                      :editing="editingVizType === PLOT_TYPES.REGION_PLOT.id"
                      :configToLoad = "currentConfig"
                      @update-visualizer="(newConfig, saveCheck) => getConfig(newConfig, saveCheck)"
                    />
                    <Volcano
                      v-else-if="vizType === PLOT_TYPES.VOLCANO_PLOT.id"
                      :editing="editingVizType === PLOT_TYPES.VOLCANO_PLOT.id"
                      :configToLoad = "currentConfig"
                      @update-visualizer="(newConfig, saveCheck) => getConfig(newConfig, saveCheck)"
                    />
                  </div>
                  <div class="col-md-2 col">
                    <button
                      class="btn btn-primary btn-sm"
                      type="button"
                      @click="saveVisualization"
                    >
                      Save
                    </button>
                    <button class="btn btn-warning btn-sm" type="button"
                      @click="cancelViz()">
                      Cancel
                    </button>
                    <button class="btn btn-danger btn-sm" type="button"
                      @click="deleteViz()">
                      Delete
                    </button>
                    <div v-if="showMsg" class="failed-save">
                      {{ failedSaveMsg }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col text-center dr-bubbles-wrapper">
                <div v-if="!!savedViz.type" class="dr-format-bubble">
                  <span class="type">{{ savedViz.type }}</span>
                  <!--span class="editing" v-if="!!editing">Editing</span-->
                  <a @click="editVisualization()"><span class="edit">Edit</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row dr-builder-ui">
        <div class="col-md-10">
          <pre class="output">{{ JSON.stringify(savedViz) }}</pre>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary btn-sm" type="button" @click="copyConfig()">
            Copy configuration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  import Manhattan from "@/components/configcomponents/visualizers/Manhattan.vue";
  import Heatmap from "@/components/configcomponents/visualizers/Heatmap.vue";
  import Phewas from "@/components/configcomponents/visualizers/Phewas.vue";
  import Region from "@/components/configcomponents/visualizers/Region.vue";
  import Volcano from "@/components/configcomponents/visualizers/Volcano.vue";
  const store = useConfigBuilderStore();
  const vizType = ref("");
  const editingVizType = ref("");
  const currentConfig = ref("");
  const savedViz = ref({});
  const failedSaveMsg = ref("Specify plot parameters.");
  const readyToSave = ref(false);
  const showMsg = ref(false);
  const PLOT_TYPES = Object.freeze({
    MANHATTAN_PLOT: {
      display: "Manhattan",
      id: "manhattan"
    },
    HEATMAP_PLOT: {
      display: "Heatmap",
      id: "heat" //only first word is looked at
    },
    PHEWAS_PLOT: {
      display: "PheWAS",
      id: "phewas"
    },
    REGION_PLOT: {
      display: "Region",
      id: "region"
    },
    VOLCANO_PLOT: {
      display: "Volcano",
      id: "volcano"
    }
  });
  function getConfig (newConfig, saveCheck) {
    showMsg.value = false;
    currentConfig.value = newConfig;
    readyToSave.value = saveCheck.ready;
    failedSaveMsg.value = saveCheck.msg;
  }
  function saveVisualization () {
    if (!readyToSave.value) {
      showMsg.value = true;
      return;
    }
    savedViz.value = JSON.parse(currentConfig.value);

    vizType.value = "";
    editingVizType.value = "";
    showMsg.value = false;
  }
  function editVisualization () {
    vizType.value = savedViz.value.type.split(" ")[0];
    editingVizType.value = vizType.value;
    currentConfig.value = JSON.stringify(savedViz.value);
  }
  watch(vizType, () => store.resetVizEditingFieldset());
  function copyConfig(){
    navigator.clipboard.writeText(JSON.stringify(savedViz.value));
  }
  function cancelViz(){
    vizType.value = "";
    editingVizType.value = "";
    showMsg.value = false;
    currentConfig.value = "";
    failedSaveMsg.value = "Specify plot parameters.";
    readyToSave.value = false;
  }
  function deleteViz(){
    cancelViz();
    savedViz.value = {};
  }
</script>
