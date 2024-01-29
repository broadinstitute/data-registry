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
                      :editing="editingVizType === PLOT_TYPES.PHEWAS_PLOT.id"
                      :configToLoad = "currentConfig"
                      @update-visualizer="(newConfig, saveCheck) => getConfig(newConfig, saveCheck)"
                    />
                    <Volcano
                      v-else-if="vizType === PLOT_TYPES.VOLCANO_PLOT.id"
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
                    <button class="btn btn-warning btn-sm" type="button">
                      Cancel
                    </button>
                    <button class="btn btn-danger btn-sm" type="button">
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
    </div>
    <div class="row card-body">
      <div class="col-md-12">
        <div class="row">
          <pre class="output">{{ JSON.stringify(savedViz) }}</pre>
        </div>
      </div>
    </div>
  </div>
  <div class="row dr-description-section">
    <div class="col-md-12">
      <h4>Legends</h4>
      <div class="row">
        <div class="col filter-col-md">
          <div class="label">
            Datatable legend
          </div>
          <textarea rows="3" class="form-control" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col filter-col-md">
          <div class="label">
            Visualizer legend
          </div>
          <textarea rows="3" class="form-control" />
        </div>
      </div>
    </div>
  </div>
  <div class="row dr-description-section">
    <div class="col-md-12">
      <h4>Page description</h4>
      <div class="row">
        <div class="col filter-col-md">
          <div class="label">
            Description<sup>*</sup>
          </div>
          <textarea rows="6" class="form-control" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col filter-col-md">
          <div class="label">
            Page style
          </div>
          <textarea rows="3" class="form-control" />
        </div>
      </div>
    </div>
  </div>
  <div class="row dr-meta-info">
    <div class="col-md-4 col filter-col-md">
      <div class="label">
        Page Mode
        <sup>*</sup>
      </div>
      <select class="form-control">
        <option value="">
          Unpublished
        </option>
        <option value="">
          Review or development
        </option>
        <option value="">
          Public
        </option>
      </select>
    </div>
    <div class="col-md-4 col filter-col-md">
      <div class="label">
        Dev ID
        <sup class="optional">If page mode in review or dev</sup>
      </div>
      <input type="text" class="form-control input-default" placeholder="Dev ID">
    </div>
    <div class="col-md-4 col filter-col-md">
      <div class="label">
        Dev password
        <sup class="optional">If page mode in review or dev</sup>
      </div>
      <input type="text" class="form-control input-default" placeholder="Dev password">
    </div>
  </div>
  <div class="row dr-meta-info">
    <div class="col-md-6 col filter-col-md">
      <div class="label">
        Research method node ID
        <sup class="optional">
          <a href="javascript:;">Tutorial</a>
        </sup>
      </div>
      <input type="text" class="form-control input-default" placeholder="Node ID">
    </div>
    <div class="col-md-6 col filter-col-md">
      <div class="label">
        Page header menu node ID
        <sup class="optional">
          <a href="javascript:;">Tutorial</a>
        </sup>
      </div>
      <input type="text" class="form-control input-default" placeholder="Node ID">
    </div>
  </div>
  <div class="row dr-meta-info">
    <div class="col-md-4 col filter-col-md">
      <div class="form-check">
        <input id="flexCheckDefault" class="form-check-input" type="checkbox" value="">
        <label class="form-check-label" for="flexCheckDefault">
          Show on BYOR front
        </label>
      </div>
    </div>
    <div class="col-md-8 col filter-col-md">
      <div class="label">
        URL to the page
        <sup class="optional">ex.
          /research.html?pageid=kp_variant_sifter&phenotype=T2D&amp;region=17:40719090-40725257
        </sup>
      </div>
      <input type="text" class="form-control input-default" placeholder="URL">
    </div>
    <div class="col-md-4 col filter-col-md">
      <div class="label">
        Image to show on BYOR front
        <sup class="optional block">
          2MB limit. png, gif, jpg or jpeg only
        </sup>
        <div class="col-md-12 col filter-col-md">
          <button class="btn btn-primary btn-sm" type="button">
            Choose file
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-8 col filter-col-md">
      <div class="label">
        Project summary
      </div>
      <textarea rows="4" class="form-control" />
    </div>
    <div class="col-md-12 col filter-col-md">
      <div class="form-check">
        <input id="flexCheckDefault" class="form-check-input" type="checkbox" value="">
        <label class="form-check-label" for="flexCheckDefault">
          Is project landing page
          <br>
          <sup class="optional block">
            The summary of Page Description field
            will show on Projects page if checked.
            Please set only 1 page per project as a
            project landing page.
          </sup>
        </label>
      </div>
    </div>
  </div>
  <div class="row dr-meta-info">
    <div class="col-md-4 col filter-col-md">
      <div class="label">
        Show portal header and menu
      </div>
      <div class="form-check">
        <input id="flexCheckDefault" class="form-check-input" type="checkbox" value="">
        <label class="form-check-label" for="flexCheckDefault">
          Show
        </label>
      </div>
    </div>
  </div>
  <div class="row dr-meta-info">
    <div class="col-md-4 col filter-col-md">
      <div class="label">
        Revision
      </div>
      <div class="form-check">
        <input id="flexCheckDefault" class="form-check-input" type="checkbox" value="">
        <label class="form-check-label" for="flexCheckDefault">
          Create revision
        </label>
      </div>
    </div>
    <div class="col-md-8 col filter-col-md">
      <div class="label">
        Revision log message
      </div>
      <input type="text" class="form-control input-default">
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
  showMsg.value = false;
  savedViz.value = JSON.parse(currentConfig.value);
  vizType.value = "";
  editingVizType.value = "";
}
function editVisualization () {
  vizType.value = savedViz.value.type.split(" ")[0];
  editingVizType.value = vizType.value;
  currentConfig.value = JSON.stringify(savedViz.value);
}
watch(vizType, () => store.resetVizEditingFieldset());
</script>
