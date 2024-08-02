<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col">
            <Breadcrumb
                :home="{ icon: 'bi-house', url: '/hermes/' }"
                :model="[
                    { label: 'Meta-Analyses', url: '/hermes/ma/' },
                    { label: id },
                ]"
                class="mb-4"
            />
            <Card>
                <template #content>
                    <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                        <div class="text-surface-700 dark:text-surface-100 text-center">
                            <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">
                                Create a meta analysis.
                            </div>
                            <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">
                                You don't have any meta analysis running. Start
                                by creating a new analysis.
                            </div>
                            <Button
                                label="Meta-Analysis"
                                icon="bi-plus-lg"
                                class="mr-2"
                                @click="router.push('/hermes/ma/new')"
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
const router = useRouter();
const maName = ref("Meta-Analysis");
const id = route.params.id;
</script>
