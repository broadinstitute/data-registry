<template>
    <div class="grid">
        <div class="col">
            <Breadcrumb
                :home="{ icon: 'bi-house', url: '/hermes/' }"
                :model="[
                    { label: 'Meta-Analyses', url: '/hermes/ma/' },
                    { label: id },
                ]"
                class="mb-3"
            />
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">
                                Create a meta analysis.
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                You don't have any meta analysis running. Start
                                by creating a new analysis.
                            </div>
                            <Button
                                label="Meta-Analysis"
                                icon="bi-plus-lg"
                                class="mr-2"
                                @click="route.push('/hermes/ma/new')"
                            ></Button>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
<script setup>
const route = useRoute();
const maName = ref("Meta-Analysis");
const id = route.params.id;
</script>
