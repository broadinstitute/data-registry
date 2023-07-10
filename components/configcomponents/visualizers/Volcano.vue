<template>
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
</template>