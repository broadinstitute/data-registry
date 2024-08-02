<script setup>
import { useUserStore } from "~/stores/UserStore";
const store = useUserStore();
const users = ref([]);

onMounted(async () => {
    users.value = await store.getHermesUsers();
});

const formatRole = (role) => {
    switch (role) {
        case "admin":
            return "success";
        case "uploader":
            return "warning";
        case "reviewer":
            return "info";
        default:
            return "secondary";
    }
};
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col">
            <Card>
                <template #content>
                    <DataTable
                        :value="users"
                        :paginator="false"
                        row-hover
                        sort-field="user_name"
                        ><template #header>
                            <div
                                class="flex justify-end flex-col sm:flex-row"
                            >
                                <Button
                                    type="button"
                                    label="Add User"
                                    icon="bi-person-plus"
                                    outlined
                                    @click="
                                        () => $router.push('/hermes/users/new')
                                    "
                                />
                            </div>
                        </template>
                        <template #empty> No user found. </template>
                        <template #loading>
                            Loading user data. Please wait...
                        </template>
                        <Column field="user_name" header="User"></Column>
                        <Column field="last_login" header="Last Login">
                            <template #body="{ data }">
                                {{ formatDate(new Date(data.last_login)) }}
                            </template>
                        </Column>
                        <Column field="created_at" header="Created On">
                            <template #body="{ data }">
                                {{ formatDate(new Date(data.created_at)) }}
                            </template>
                        </Column>
                        <Column field="role" header="Role">
                            <template #body="{ data }">
                                <Tag
                                    :severity="formatRole(data.role)"
                                    :value="data.role"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped></style>
