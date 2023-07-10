<template>
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
</template>