<script setup>
import { useLayout } from "@/layouts/composables/layout";
import { ProductService } from "@/service/ProductService";
import { onMounted, reactive, ref, watch } from "vue";
const { isDarkTheme } = useLayout();
const products = ref(null);
const config = useRuntimeConfig();
const store = useDatasetStore();
const datasets = ref([]);
const axios = useAxios(config, undefined, (error) => {
    console.log(error);
    throw new Error("Server Error");
});
const lineData = reactive({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "Datasets",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: "#2f4860",
            borderColor: "#2f4860",
            tension: 0.4,
        },
        {
            label: "Credible Sets",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            tension: 0.4,
        },
    ],
});
const items = ref([
    { label: "Add New", icon: "pi pi-fw pi-plus" },
    { label: "Remove", icon: "pi pi-fw pi-minus" },
]);
const lineOptions = ref(null);

onMounted(async () => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
    datasets.value = (await axios.get(`/api/datasets`)).data.map((ds) => {
        return { ...ds, showFiles: false };
    });
});

const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: "#495057",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
            y: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
        },
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: "#ebedef",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#ebedef",
                },
                grid: {
                    color: "rgba(160, 167, 181, .3)",
                },
            },
            y: {
                ticks: {
                    color: "#ebedef",
                },
                grid: {
                    color: "rgba(160, 167, 181, .3)",
                },
            },
        },
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true },
);
</script>

<template>
    <div class="grid">
        <!-- <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3"
                            >Datasets</span
                        >
                        <div class="text-900 font-medium text-xl">144</div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-list text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">12 new </span>
                <span class="text-500">since last visit</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3"
                            >Credible Sets</span
                        >
                        <div class="text-900 font-medium text-xl">88</div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-th-large text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">4+ </span>
                <span class="text-500">since last week</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3"
                            >Storage</span
                        >
                        <div class="text-900 font-medium text-xl">28.4TB</div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-database text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520MB </span>
                <span class="text-500">newly uploaded</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3"
                            >Projects</span
                        >
                        <div class="text-900 font-medium text-xl">2</div>
                    </div>
                    <div
                        class="flex align-items-center justify-content-center bg-purple-100 border-round"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i
                            class="pi pi-folder-open text-purple-500 text-xl"
                        ></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">1 </span>
                <span class="text-500">Active</span>
            </div>
        </div> -->

        <div class="col-12">
            <div class="card">
                <h5>Recent Datasets</h5>
                <DataTable
                    :value="datasets"
                    :pt="{
                        table: 'table table-striped',
                    }"
                    stripedRows
                    tableStyle="min-width: 50rem"
                    paginator
                    :rows="5"
                >
                    <Column header="Name">
                        <template #body="{ data }">
                            <NuxtLink :to="`/datasets/${data.id}`">{{
                                data.name
                            }}</NuxtLink>
                        </template>
                    </Column>
                    <Column field="project" header="Project"></Column>
                    <Column field="data_type" header="Type"></Column>
                    <Column field="data_submitter" header="Submitter"></Column>
                    <Column
                        header="Date"
                        field="created_at"
                        dataType="date"
                        style="min-width: 10rem"
                        ><template #body="{ data }">
                            {{
                                data.created_at
                                    ? data.created_at.split("T")[0]
                                    : ""
                            }}</template
                        >
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <!-- <div class="card">
                <h5>Recent Datasets</h5>
                <DataTable
                    :value="products"
                    :rows="5"
                    :paginator="true"
                    responsiveLayout="scroll"
                >
                    <Column
                        field="name"
                        header="File"
                        :sortable="true"
                        style="width: 30%"
                    ></Column>
                    <Column style="width: 10%">
                        <template #header> Type </template>
                        <template #body
                            >GWAS

                        </template>
                    </Column>
                    <Column
                        field="date"
                        header="Date"
                        :sortable="true"
                        style="width: 20%"
                    >
                        <template #body="slotProps">
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                    <Column style="width: 35%">
                        <template #header> Uploader </template>
                        <template #body="slotProps">
                            {{ slotProps.data.user }}
                        </template>
                    </Column>
                    <Column style="width: 5%">
                        <template #header> View </template>
                        <template #body>
                            <Button
                                icon="pi pi-search"
                                type="button"
                                class="p-button-text"
                            ></Button>
                        </template>
                    </Column>
                </DataTable>
            </div> -->

            <div class="card">
                <div
                    class="flex justify-content-between align-items-center mb-5"
                >
                    <h5>Job Statuses</h5>
                    <div>
                        <Button
                            icon="pi pi-ellipsis-v"
                            class="p-button-text p-button-plain p-button-rounded"
                            @click="$refs.menu2.toggle($event)"
                        ></Button>
                        <Menu ref="menu2" :popup="true" :model="items"></Menu>
                    </div>
                </div>
                <ul class="list-none p-0 m-0">
                    <li
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                    >
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                                >Dataset 1</span
                            >
                            <div class="mt-1 text-600">Meta-analysis</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex align-items-center">
                            <div
                                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                style="height: 8px"
                            >
                                <div
                                    class="bg-orange-500 h-full"
                                    style="width: 50%"
                                ></div>
                            </div>
                            <span class="text-orange-500 ml-3 font-medium"
                                >50%</span
                            >
                        </div>
                    </li>
                    <li
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                    >
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                                >Dataset 3</span
                            >
                            <div class="mt-1 text-600">Generating BioIndex</div>
                        </div>
                        <div
                            class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center"
                        >
                            <div
                                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                style="height: 8px"
                            >
                                <div
                                    class="bg-cyan-500 h-full"
                                    style="width: 16%"
                                ></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium"
                                >16%</span
                            >
                        </div>
                    </li>
                    <li
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                    >
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                                >Dataset 7</span
                            >
                            <div class="mt-1 text-600">Compressing</div>
                        </div>
                        <div
                            class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center"
                        >
                            <div
                                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                style="height: 8px"
                            >
                                <div
                                    class="bg-pink-500 h-full"
                                    style="width: 67%"
                                ></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium"
                                >67%</span
                            >
                        </div>
                    </li>
                    <li
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                    >
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                                >Dataset 23</span
                            >
                            <div class="mt-1 text-600">Quality Check</div>
                        </div>
                        <div
                            class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center"
                        >
                            <div
                                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                style="height: 8px"
                            >
                                <div
                                    class="bg-green-500 h-full"
                                    style="width: 35%"
                                ></div>
                            </div>
                            <span class="text-green-500 ml-3 font-medium"
                                >35%</span
                            >
                        </div>
                    </li>
                    <li
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                    >
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                                >Dataset 9</span
                            >
                            <div class="mt-1 text-600">Method abc-xyz</div>
                        </div>
                        <div
                            class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center"
                        >
                            <div
                                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                style="height: 8px"
                            >
                                <div
                                    class="bg-purple-500 h-full"
                                    style="width: 75%"
                                ></div>
                            </div>
                            <span class="text-purple-500 ml-3 font-medium"
                                >75%</span
                            >
                        </div>
                    </li>
                    <li
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                    >
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                                >Dataset 8</span
                            >
                            <div class="mt-1 text-600">BioIndex Generated</div>
                        </div>
                        <div
                            class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center"
                        >
                            <div
                                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                style="height: 8px"
                            >
                                <div
                                    class="bg-teal-500 h-full"
                                    style="width: 100%"
                                ></div>
                            </div>
                            <span class="text-teal-500 ml-3 font-medium"
                                >100%</span
                            >
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <!--<div class="card">
                <h5>New Datasets</h5>
                 <Chart type="line" :data="lineData" :options="lineOptions" />
            </div> -->
            <div class="card">
                <div
                    class="flex align-items-center justify-content-between mb-4"
                >
                    <h5>Updates</h5>
                    <div>
                        <Button
                            icon="pi pi-ellipsis-v"
                            class="p-button-text p-button-plain p-button-rounded"
                            @click="$refs.menu1.toggle($event)"
                        ></Button>
                        <Menu ref="menu1" :popup="true" :model="items"></Menu>
                    </div>
                </div>

                <span class="block text-600 font-medium mb-3">TODAY</span>
                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li
                        class="flex align-items-center py-2 border-bottom-1 surface-border"
                    >
                        <div
                            class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"
                        >
                            <i class="pi pi-upload text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >Reed Richards
                            <span class="text-700"
                                >has uploaded
                                <span class="text-blue-500"
                                    >filename_xyz.gz</span
                                ></span
                            >
                        </span>
                    </li>
                    <li class="flex align-items-center py-2">
                        <div
                            class="w-3rem h-3rem flex align-items-center justify-content-center bg-green-100 border-circle mr-3 flex-shrink-0"
                        >
                            <i class="pi pi-check text-xl text-green-500"></i>
                        </div>
                        <span class="text-700 line-height-3"
                            >Quality check for file
                            <span class="text-blue-500">filename_abc.json</span>
                            has been initiated.</span
                        >
                    </li>
                </ul>

                <span class="block text-600 font-medium mb-3">YESTERDAY</span>
                <ul class="p-0 m-0 list-none">
                    <li
                        class="flex align-items-center py-2 border-bottom-1 surface-border"
                    >
                        <div
                            class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0"
                        >
                            <i
                                class="pi pi-exclamation-triangle text-xl text-orange-500"
                            ></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >John Wick deleted
                            <span class="text-blue-500"
                                >filename_genes.tsv</span
                            >
                        </span>
                    </li>
                    <li
                        class="flex align-items-center py-2 border-bottom-1 surface-border"
                    >
                        <div
                            class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"
                        >
                            <i class="pi pi-upload text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >John Wick
                            <span class="text-700"
                                >has uploaded
                                <span class="text-blue-500"
                                    >filename_genes_v2.tsv</span
                                ></span
                            >
                        </span>
                    </li>
                </ul>
            </div>
            <div
                class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                style="
                    border-radius: 1rem;
                    background: linear-gradient(
                            0deg,
                            rgba(42, 140, 245, 0.5),
                            rgba(108, 177, 252, 0.5)
                        ),
                        linear-gradient(
                            92.54deg,
                            #1c80cf 47.88%,
                            #ffffff 100.01%
                        );
                "
            >
                <div>
                    <div class="text-blue-100 font-medium text-xl mt-2 mb-3">
                        Learn the basics
                    </div>
                    <div class="text-white font-medium text-4xl">
                        Documentations & Tutorials
                    </div>
                </div>
                <div class="mt-4 mr-auto md:mt-0 md:mr-0">
                    <a
                        href="https://hugeamp.org"
                        class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
