<template>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Pub Id</th>
                <th scope="col">Data Type</th>
                <th scope="col">Ancestry</th>
                <th scope="col">Sex</th>
                <th scope="col">Samples</th>
                <th scope="col">Status</th>
                <th scope="col">Submitter</th>

                <th scope="col">Uploaded</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr
                v-for="dataset in props.dataSets"
                :key="dataset.id"
                @click="route.push({ path: `/datasets/${dataset.id}` })"
            >
                <td>{{ dataset.name }}</td>
                <td>
                    {{
                        dataset.description.length <= 20
                            ? dataset.description
                            : dataset.description.substring(0, 20) + "..."
                    }}
                </td>
                <td>{{ dataset.pub_id }}</td>
                <td>{{ dataset.data_type }}</td>
                <td>{{ dataset.ancestry }}</td>
                <td v-html="formatSex(dataset.sex)"></td>
                <td>{{ dataset.global_sample_size }}</td>
                <td>{{ dataset.status }}</td>
                <td>{{ dataset.data_submitter }}</td>

                <td>{{ dataset.created_at }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
const props = defineProps({ dataSets: Array });
const route = useRouter();

function formatSex(gender) {
    if (!gender) return "";
    else {
        switch (gender) {
            case "female":
                return '<span class="badge rounded-pill bg-info"><i class="bi bi-gender-female"></i> Female</span>';
            case "male":
                return '<span class="badge rounded-pill bg-warning"><i class="bi bi-gender-male"></i> Male</span>';
            case "mixed":
                return '<span class="badge rounded-pill bg-danger"><i class="bi bi-gender-ambiguous"></i> Mixed</span>';
            default:
                return "";
        }
    }
}
</script>
<style scoped></style>
