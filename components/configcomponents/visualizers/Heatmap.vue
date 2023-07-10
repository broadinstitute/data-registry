<template>
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
            <option v-for="field in availableFields">{{ field }}</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-md-3">
        Row field:
    </div>
    <div class="col-md-9">
        <select class="form-control form-control-sm">
            <option v-for="field in availableFields">{{ field }}</option>
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
            <option v-for="field in availableFields">{{ field }}</option>
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
            <option v-for="field in availableFields">{{ field }}</option>
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
</template>
<script setup>
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const availableFields = computed(() => props.fields);
</script>