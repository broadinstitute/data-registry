<template>
    <div class="grid">
        <div class="col-12">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
                    User Management
                </h2>
                <Button
                    v-if="userStore.canManageHCMUsers() && !showCreateForm"
                    label="Create New User"
                    icon="pi pi-user-plus"
                    @click="showCreateForm = true"
                    class="p-button-primary"
                />
            </div>

            <!-- Permission Check -->
            <div v-if="!userStore.canManageHCMUsers()" class="col-12">
                <Message severity="warn" :closable="false">
                    <p class="m-0">
                        <i class="pi pi-exclamation-triangle mr-2"></i>
                        You don't have permission to manage users. Only HCM reviewers can create new user accounts.
                    </p>
                </Message>
            </div>

            <!-- User Creation Form -->
            <div v-if="showCreateForm && userStore.canManageHCMUsers()" class="col-12 mb-4">
                <HCMUserForm
                    @user-created="handleUserCreated"
                    @cancel="showCreateForm = false"
                />
            </div>

            <!-- Users List -->
            <div v-if="!showCreateForm" class="col-12">
                <Card>
                    <template #header>
                        <div class="p-4">
                            <h3 class="text-xl font-medium text-surface-900 dark:text-surface-0 mb-2">
                                HCM Users
                            </h3>
                            <p class="text-surface-600 dark:text-surface-400 m-0">
                                Manage HCM user accounts and permissions
                            </p>
                        </div>
                    </template>

                    <template #content>
                        <div v-if="loadingUsers" class="text-center p-4">
                            <ProgressSpinner />
                            <p class="mt-3 text-surface-600 dark:text-surface-400">Loading users...</p>
                        </div>

                        <div v-else-if="users.length === 0" class="text-center p-4">
                            <div class="text-surface-600 dark:text-surface-400">
                                <i class="pi pi-users text-6xl mb-4 block"></i>
                                <p class="text-lg mb-2">No users found</p>
                                <p class="mb-4">Users you create will appear here</p>
                            </div>
                        </div>

                        <DataTable v-else :value="users" class="w-full" paginator :rows="10" :loading="loadingUsers">
                            <template #empty>
                                No users found.
                            </template>
                            
                            <Column field="username" header="Username" sortable>
                                <template #body="slotProps">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-user text-surface-600 mr-2"></i>
                                        <span class="font-medium">{{ slotProps.data.username }}</span>
                                    </div>
                                </template>
                            </Column>

                            <Column field="email" header="Email" sortable>
                                <template #body="slotProps">
                                    <span v-if="slotProps.data.email" class="text-surface-700 dark:text-surface-300">
                                        {{ slotProps.data.email }}
                                    </span>
                                    <span v-else class="text-surface-400 dark:text-surface-500 italic">
                                        No email provided
                                    </span>
                                </template>
                            </Column>

                            <Column field="full_name" header="Name" sortable>
                                <template #body="slotProps">
                                    <span v-if="slotProps.data.first_name || slotProps.data.last_name">
                                        {{ `${slotProps.data.first_name || ''} ${slotProps.data.last_name || ''}`.trim() }}
                                    </span>
                                    <span v-else class="text-surface-400 dark:text-surface-500 italic">
                                        No name provided
                                    </span>
                                </template>
                            </Column>

                            <Column field="roles" header="Roles">
                                <template #body="slotProps">
                                    <div class="flex gap-1">
                                        <Tag
                                            v-for="role in slotProps.data.roles"
                                            :key="role.id || role.name || role"
                                            :value="role.name || role"
                                            :severity="getTagSeverity(role.name || role)"
                                            rounded
                                        />
                                        <span v-if="!slotProps.data.roles?.length" class="text-surface-400 dark:text-surface-500 italic">
                                            No roles assigned
                                        </span>
                                    </div>
                                </template>
                            </Column>

                            <Column field="date_joined" header="Created" sortable>
                                <template #body="slotProps">
                                    <span class="text-surface-600 dark:text-surface-400">
                                        {{ formatDate(slotProps.data.date_joined) }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="is_active" header="Status">
                                <template #body="slotProps">
                                    <Tag 
                                        :value="slotProps.data.is_active ? 'Active' : 'Inactive'"
                                        :severity="slotProps.data.is_active ? 'success' : 'danger'"
                                        rounded
                                    />
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>
        </div>
    </div>

    <Toast position="top-center" />
</template>

<script setup>
import { useUserStore } from "~/stores/UserStore";
import { useToast } from "primevue/usetoast";
import HCMUserForm from "~/components/HCMUserForm.vue";

definePageMeta({
  layout: 'hcm'
});

const userStore = useUserStore();
const toast = useToast();

const showCreateForm = ref(false);
const loadingUsers = ref(false);
const users = ref([]);

const getTagSeverity = (role) => {
    switch (role?.toLowerCase()) {
        case 'reviewer':
        case 'hcm-reviewer':
            return 'info';
        case 'uploader':
        case 'hcm-uploader':
            return 'success';
        case 'admin':
            return 'danger';
        default:
            return 'secondary';
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid date';
    }
};

const loadUsers = async () => {
    if (!userStore.canManageHCMUsers()) {
        return;
    }

    loadingUsers.value = true;
    try {
        users.value = await userStore.getHCMUsers();
    } catch (error) {
        console.error('Error loading users:', error);
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users.',
            life: 5000
        });
    } finally {
        loadingUsers.value = false;
    }
};

const handleUserCreated = async (newUser) => {
    showCreateForm.value = false;
    await loadUsers();

    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User created successfully',
        life: 3000
    });
};

onMounted(async () => {
    if (userStore.canManageHCMUsers()) {
        await loadUsers();
    }
});
</script>

<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem 0.75rem;
}

.p-card .p-card-header {
    border-bottom: 1px solid var(--surface-border);
}
</style>
