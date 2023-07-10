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
                                        <select class="form-control">
                                            <option>Manhattan (vector)</option>
                                            <option>Manhattan (bitmap)</option>
                                            <option>Heatmap</option>
                                            <option>Phewas</option>
                                            <option>Region</option>
                                            <!--<option>Score</option>-->
                                            <option>Volcano</option>
                                        </select>
                                    </div>
                                                    <!-- Manhattan (vector) 
    {"type":"manhattan plot",
    "x axis field": "Region",
    "y axis field": "Top score",
    "render by": "Gene",
    "y axis label": "Top score",
    "height":250,
    "x axis label": "Region",
    "link to":"/region.html",
    "hover content": ["Region","Curated Approach probability","Curated Approach locus","EPI probability","EPI locus","ICP probability","ICP locus"]}-->
                                    <div class="col-md-6 col">
                                        <div class="label">
                                            Set parameters
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control input-default form-control-sm"/>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control input-default form-control-sm"/>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render by:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Hover content:
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 1
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 2
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 3
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Link to:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Height:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <!-- Manhattan (bitmap) 
    {"type":"manhattan bitmap plot",
    "x axis field": "locus",
    "y axis field": "pval_ng_log10",
    "render by": "rsID",
    "y axis label": "-Log10(p-value)",
    "x axis label": "Chromosome",
    "hover content": ["locus","P-value"],
    "height": 300}-->
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render by:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Hover content:
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label 
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 1
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input 
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 2
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 3
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Link to:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Height:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                            <!-- Heat map 
    {"type":"heat map",
    "label": "Epigenomic enrichment of Genetic Clusters obs_cppa heatmap",
    "main": {"field": "obs_cppa", "label": "Effect size", "type": "scale", "direction": "positive", "low": 0, "middle": 0, "high": 0.25},
    "sub": {"field": "p", "label": "P-value", "type": "steps", "direction": "negative", "value range": [0.001, 0.05]},
    "column field": "annotation",
    "column label": "annotation",
    "row field": "cluster",
    "row label": "cluster",
    "font size": 12}-->
                                        <div class="row">
                                            <div class="col-md-3">
                                                Plot label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Column field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Row field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Font size
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="label">
                                            Main box
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Label
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render type
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Scale</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Direction
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Positive(higher darker)</option>
                                                    <option>Negative(lower darker)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Lowest value
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Lowest value
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Middle value
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Highest value
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="label">
                                            Sub circle (Optional)
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Label
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render type
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Steps</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Direction
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Positive (higher bigger)</option>
                                                    <option>Negative (lower bigger)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Value steps
                                                <small>(separate with ,)</small>
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <!-- PheWAS
                                                            {"type":"phewas plot",
    "group by": "phenotype group",
    "y axis field": "pValue",
    "convert y -log10":"true",
    'y ticks decimal point': "2",
    "phenotype map":"kp phenotype map",
    "render by": "phenotype",
    "y axis label": "-Log10(p-value)",
    "x axis label": "beta",
    "beta field": "beta",
    "hover content": ["pValue","beta"],
    "thresholds": ["2.5e-6"],
    "height": 500,
    "star key":"phenotype"
            }-->
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        <small>
                                                            Convert y axis value to -log10
                                                        </small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                            </div>
                                            <div class="col-md-9">
                                                <div class="row">
                                                    <div class="col-md-8">
                                                        <small>
                                                            Place to render after decimal point:
                                                        </small>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <input 
                                                            class="form-control input-default form-control-sm"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Beta field
                                                <small>(Direction)</small>
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Null</option>
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render by:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Group by:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                thresholds
                                                <small>(separate with ,)</small>
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Hover content:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Height:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <!-- Region plot 
    {"type":"region plot",
    "x axis field": "position",
    "y axis field": "-log10(P-Value)",
    "y axis label": "-Log10(p-value)",
    "x axis label": "Position",
    "render by": "Variant ID",
    "hover content": ["P-Value","Beta"],
    "height": 200,
    "zoom":"true",
    "star key":"Variant ID",
    "ld server":{
    "pos":"position",
    "ref":"ref",
    "alt":"alt",
    "ref variant field":"Variant ID",
    "populations field":"Ancestry",
    "populations type":"dynamic",
    "populations":{"Mixed":"ALL","EU":"EUR","AA":"AFR","EA":"EAS","HS":"AMR","SA":"SAS"}},
    "genes track":{"input type":"dynamic","dynamic parameter":"region"}
            }
            -->
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render by:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Hover content:
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 1
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 2
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        Field 3
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Height:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Star key:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Zoom:
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                        checked
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="flexCheckDefault"
                                                    >
                                                        True if
                                                        checked
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="label">
                                            LD server
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Position field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Reference allele:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Alternative allele:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Reference variant field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Populations type:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Static</option>
                                                    <option>Dynamic</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Populations parameter:
                                            </div>
                                            <div class="col-md-6">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                            <div class="col-md-3">
                                                If type dynamic
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Populations ids:
                                            </div>
                                            <div class="col-md-9">
                                                <div>
                                                    <label class="form-check-label">
                                                        Check only 1 if type static
                                                    </label>
                                                </div>
                                                <div class="form-group row">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label for="popAll" class="col-sm-2 form-check-label">
                                                        ALL
                                                    </label>
                                                    <div class="col-sm-7">
                                                        <input
                                                            type="text"
                                                            class="form-control input-default form-control-sm"
                                                            id="popAll"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label for="popEur" class="col-sm-2 form-check-label">
                                                        EUR
                                                    </label>
                                                    <div class="col-sm-7">
                                                        <input
                                                            type="text"
                                                            class="form-control input-default form-control-sm"
                                                            id="popEur"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label for="popAfr" class="col-sm-2 form-check-label">
                                                        AFR
                                                    </label>
                                                    <div class="col-sm-7">
                                                        <input
                                                            type="text"
                                                            class="form-control input-default form-control-sm"
                                                            id="popAfr"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label for="popEas" class="col-sm-2 form-check-label">
                                                        EAS
                                                    </label>
                                                    <div class="col-sm-7">
                                                        <input
                                                            type="text"
                                                            class="form-control input-default form-control-sm"
                                                            id="popEas"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label for="popAmr" class="col-sm-2 form-check-label">
                                                        AMR
                                                    </label>
                                                    <div class="col-sm-7">
                                                        <input
                                                            type="text"
                                                            class="form-control input-default form-control-sm"
                                                            id="popAmr"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="flexCheckDefault"
                                                    />
                                                    <label for="popSas" class="col-sm-2 form-check-label">
                                                        SAS
                                                    </label>
                                                    <div class="col-sm-7">
                                                        <input
                                                            type="text"
                                                            class="form-control input-default form-control-sm"
                                                            id="popSas"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="label">
                                            Genes track
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Input type:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Static</option>
                                                    <option>Dynamic</option>
                                                    <option>From data</option>
                                                </select>
                                            </div>
                                        </div>
                                        <!-- if input type static -->
                                        <div class="row">
                                            <div class="col-md-6">
                                                Region (chromosome:start-end):
                                            </div>
                                            <div class="col-md-6">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <!-- if input type dynamic -->
                                        <div class="row">
                                            <div class="col-md-6">
                                                Region parameter:
                                            </div>
                                            <div class="col-md-6">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <!-- if input type from data -->
                                        <div class="row">
                                            <div class="col-md-12">
                                                Required fields in data: chromosome, position
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Height:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <!-- Volcano plot
                                                        
    {"type":"volcano plot",
    "x axis field": "Log2 Fold Change",
    "x axis label": "Log2 Fold Change",
    "y axis field": "negLog10P",
    "y axis label": "P-value (-Log10)",
    "render by": "Gene Symbol",
    "x condition": {"combination":"or","greater than":0.5,"lower than":-0.5},
    "y condition": {"combination":"greater than","greater than":4.60206},
    "dot label score": 2
    "width": 800,
    "height": 400,
    "label": "Volcano Plot of Differentially Expressed Genes - High-risk vs Low-risk APOL1 genotype",
    "legend": "<span class='volcano-score-0'>&nbsp;</span> NS <span class='volcano-score-1'>&nbsp;</span> Log<sub>2</sub> FC <span class='volcano-score-2'>&nbsp;</span> p-value and log<sub>2</sub> FC<br>Genes with positive fold change are upregulated in high-risk samples",
    }
                                                        -->
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select
                                                    class="form-control form-control-sm"
                                                >
                                                    <option>
                                                        field 1
                                                    </option>
                                                    <option>
                                                        field 2
                                                    </option>
                                                    <option>
                                                        field 3
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis field:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                X Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Y Axis label:
                                            </div>
                                            <div class="col-md-9">
                                                <input
                                                    type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Render by:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>field 1</option>
                                                    <option>field 2</option>
                                                    <option>field 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="label">
                                            X axis field condition
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Combination:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Greater than</option>
                                                    <option>Lower than</option>
                                                    <option>AND</option>
                                                    <option>OR</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-group row">
                                                    <label for="xGT"
                                                        class="col-sm-6 form-check-label">
                                                            Greater than
                                                    </label>
                                                    <div class="col-sm-6">
                                                        <input type="text" id="xGT"
                                                            class="form-control input-default form-control-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label for="xLT"
                                                        class="col-sm-6 form-check-label">
                                                            Lower than
                                                    </label>
                                                    <div class="col-sm-6">
                                                        <input type="text" id="xLT"
                                                            class="form-control input-default form-control-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="label">
                                            Y axis field condition
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Combination:
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>Greater than</option>
                                                    <option>Lower than</option>
                                                    <option>AND</option>
                                                    <option>OR</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                            </div>
                                            <div class="col-md-9">
                                                <div class="form-group row">
                                                    <label for="yGT"
                                                        class="col-sm-6 form-check-label">
                                                            Greater than
                                                    </label>
                                                    <div class="col-sm-6">
                                                        <input type="text" id="yGT"
                                                            class="form-control input-default form-control-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label for="yLT"
                                                        class="col-sm-6 form-check-label">
                                                            Lower than
                                                    </label>
                                                    <div class="col-sm-6">
                                                        <input type="text" id="yLT"
                                                            class="form-control input-default form-control-sm"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Label dots if meet
                                            </div>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm">
                                                    <option>1 condition</option>
                                                    <option>2 conditions</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Width:
                                            </div>
                                            <div class="col-md-9">
                                                <input type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Height:
                                            </div>
                                            <div class="col-md-9">
                                                <input type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                Label:
                                            </div>
                                            <div class="col-md-9">
                                                <input type="text"
                                                    class="form-control input-default form-control-sm"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                In plot legend:
                                            </div>
                                            <div class="col-md-9">
                                                <textarea rows="6" class="form-control">
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <!--<div class="col-md-3 col">
                                                        <div class="label">
                                                            Filter type
                                                        </div>

                                                        <select
                                                            class="form-control"
                                                        >
                                                            <option>Search</option>
                                                            <option>
                                                                Search greater than
                                                            </option>
                                                            <option>
                                                                Search lower than
                                                            </option>
                                                            <option>
                                                                Search or
                                                            </option>
                                                            <option>
                                                                Search and
                                                            </option>
                                                            <option>
                                                                Dropdown
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-3 col">
                                                        <div class="label">
                                                            Label
                                                        </div>

                                                        <input
                                                            type="text"
                                                            class="form-control input-default"
                                                        />
                                                    </div>-->
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