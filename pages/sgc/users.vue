<template>
    <div class="grid">
        <div class="col-12">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
                    User Management
                </h2>
                <Button
                    v-if="userStore.canManageUsers() && !showCreateForm"
                    label="Create New User"
                    icon="pi pi-user-plus"
                    @click="showCreateForm = true"
                    class="p-button-primary"
                />
            </div>

            <!-- Permission Check -->
            <div v-if="!userStore.canManageUsers()" class="col-12">
                <Message severity="warn" :closable="false">
                    <p class="m-0">
                        <i class="pi pi-exclamation-triangle mr-2"></i>
                        You don't have permission to manage users. Only SGC reviewers can create new user accounts.
                    </p>
                </Message>
            </div>

            <!-- User Creation Form -->
            <div v-if="showCreateForm && userStore.canManageUsers()" class="col-12 mb-4">
                <SGCUserForm
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
                                SGC Users
                            </h3>
                            <p class="text-surface-600 dark:text-surface-400 m-0">
                                Manage SGC user accounts and permissions
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
import SGCUserForm from "~/components/SGCUserForm.vue";

definePageMeta({
  layout: 'sgc'
});

const userStore = useUserStore();
const toast = useToast();

const showCreateForm = ref(false);
const loadingUsers = ref(false);
const users = ref([]);

const getTagSeverity = (role) => {
    switch (role?.toLowerCase()) {
        case 'reviewer':
        case 'sgc-reviewer':
            return 'info';
        case 'uploader':
        case 'sgc-uploader':
            return 'success';
        case 'admin':
        case 'sgc-admin':
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
    if (!userStore.canManageUsers()) {
        return;
    }

    loadingUsers.value = true;
    try {
        users.value = await userStore.getSGCUsers();
    } catch (error) {
        console.error('Error loading users:', error);
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users. This feature may need backend implementation.',
            life: 5000
        });
    } finally {
        loadingUsers.value = false;
    }
};

const handleUserCreated = async (newUser) => {
    showCreateForm.value = false;

    // Reload users list to get fresh data with proper formatting
    await loadUsers();

    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User created successfully',
        life: 3000
    });
};

// Load users on mount if user has permissions
onMounted(async () => {
    if (userStore.canManageUsers()) {
        await loadUsers();
    }
});
</script>

<style scoped>
/* Custom styles for better spacing and visual hierarchy */
.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem 0.75rem;
}

.p-card .p-card-header {
    border-bottom: 1px solid var(--surface-border);
}
</style>
