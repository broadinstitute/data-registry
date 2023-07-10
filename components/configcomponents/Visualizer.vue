<template>
    <div class="card mdkp-card">
        <div class="row card-body dr-description-section">
            <div class="col-md-12">
                <h4>Visualizer</h4>
                <div class="row">
                    <div class="col filter-col-md">
                        <div class="label">
                            Visualizer configuration
                        </div>
                        <pre></pre>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row dr-builder-ui">
                                    <div class="col-md-4 col">
                                        <div class="label">
                                            Select visualizer
                                        </div>
                                        <select v-model="visType" class="form-control">
                                            <option value="">Select a visualizer</option>
                                            <option value="manhattan">Manhattan</option>
                                            <option value="heatmap">Heatmap</option>
                                            <option value="phewas">PheWAS</option>
                                            <option value="region">Region</option>
                                            <!--<option>Score</option>-->
                                            <option value="volcano">Volcano</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 col">
                                        <div class="label">
                                            Set parameters
                                        </div>
                                        <Manhattan v-if="visType == 'manhattan'">
                                        </Manhattan>
                                        <Heatmap v-if="visType == 'heatmap'">
                                        </Heatmap>
                                        <Phewas v-if="visType == 'phewas'">
                                        </Phewas> 
                                        <Region v-if="visType == 'region'">
                                        </Region>
                                        <Volcano v-if="visType == 'volcano'">
                                        </Volcano>
                                    </div>
                                    <div class="col-md-2 col">
                                        <button class="btn btn-primary btn-sm" type="button">
                                            Save
                                        </button>
                                        <button class="btn btn-warning btn-sm" type="button">
                                            Cancel
                                        </button>
                                        <button class="btn btn-danger btn-sm" type="button">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <textarea rows="3" class="form-control"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 col filter-col-md">
                    <div class="label">
                        Visualizer legend
                    </div>
                    <textarea rows="3" class="form-control"></textarea>
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
                    <textarea rows="6" class="form-control"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 col filter-col-md">
                    <div class="label">
                        Page style
                    </div>
                    <textarea rows="3" class="form-control"></textarea>
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
                <option value="">Unpublished</option>
                <option value="">Review or development</option>
                <option value="">Public</option>
            </select>
        </div>
        <div class="col-md-4 col filter-col-md">
            <div class="label">
                Dev ID
                <sup class="optional">If page mode in review or dev</sup>
            </div>
            <input type="text" class="form-control input-default" placeholder="Dev ID"/>
        </div>
        <div class="col-md-4 col filter-col-md">
            <div class="label">
                Dev password
                <sup class="optional">If page mode in review or dev</sup>
            </div>
            <input type="text" class="form-control input-default" placeholder="Dev password"/>
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
            <input type="text" class="form-control input-default" placeholder="Node ID"/>
        </div>
        <div class="col-md-6 col filter-col-md">
            <div class="label">
                Page header menu node ID
                <sup class="optional">
                    <a href="javascript:;">Tutorial</a>
                </sup>
            </div>
            <input type="text" class="form-control input-default" placeholder="Node ID"/>
        </div>
    </div>
    <div class="row dr-meta-info">
        <div class="col-md-4 col filter-col-md">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label class="form-check-label" for="flexCheckDefault">
                    Show on BYOR front
                </label>
            </div>
        </div>
        <div class="col-md-8 col filter-col-md">
            <div class="label">
                URL to the page
                <sup class="optional">ex.
                    /research.html?pageid=kp_variant_sifter&phenotype=T2D&region=17:40719090-40725257
                </sup>
            </div>
            <input type="text" class="form-control input-default" placeholder="URL"/>
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
            <textarea rows="4" class="form-control"></textarea>
        </div>
        <div class="col-md-12 col filter-col-md">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label class="form-check-label" for="flexCheckDefault">
                    Is project landing page
                    <br />
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
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
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
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label class="form-check-label" for="flexCheckDefault">
                    Create revision
                </label>
            </div>
        </div>
        <div class="col-md-8 col filter-col-md">
            <div class="label">
                Revision log message
            </div>
            <input type="text" class="form-control input-default"/>
        </div>
    </div>  
</template>
<script setup>
    import Manhattan from "@/components/configcomponents/visualizers/Manhattan.vue";
    import Heatmap from "@/components/configcomponents/visualizers/Heatmap.vue";
    import Phewas from "@/components/configcomponents/visualizers/Phewas.vue";
    import Region from "@/components/configcomponents/visualizers/Region.vue";
    import Volcano from "@/components/configcomponents/visualizers/Volcano.vue";
    const visType = ref("");
</script>