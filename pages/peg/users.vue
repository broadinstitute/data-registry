<template>
  <div class="grid">
    <div class="col-12">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-surface-900">PEG Users</h2>
      </div>

      <div v-if="!userStore.canReviewPEG()" class="col-12">
        <Message severity="warn" :closable="false">
          <p class="m-0">
            <i class="pi pi-exclamation-triangle mr-2"></i>
            You don't have permission to view users. Only PEG reviewers can list user accounts.
          </p>
        </Message>
      </div>

      <Card v-else>
        <template #header>
          <div class="p-4">
            <h3 class="text-xl font-medium m-0 mb-2">All PEG users</h3>
            <p class="text-surface-600 m-0">
              Users in the PEG group, including peg-uploader and peg-reviewer accounts.
            </p>
          </div>
        </template>

        <template #content>
          <div v-if="loading" class="text-center p-4">
            <ProgressSpinner />
            <p class="mt-3 text-surface-600">Loading users...</p>
          </div>

          <div v-else-if="loadError" class="text-center p-4">
            <Message severity="error" :closable="false">{{ loadError }}</Message>
          </div>

          <DataTable
            v-else
            :value="users"
            class="w-full"
            paginator
            :rows="10"
            stripedRows
            :rowHover="true"
          >
            <template #empty>
              <div class="text-center p-4 text-surface-600">No users found.</div>
            </template>

            <Column field="username" header="Username" sortable>
              <template #body="{ data }">
                <div class="flex align-items-center">
                  <i class="pi pi-user text-surface-600 mr-2"></i>
                  <span class="font-medium">{{ data.username }}</span>
                </div>
              </template>
            </Column>

            <Column field="email" header="Email" sortable>
              <template #body="{ data }">
                <span v-if="data.email" class="text-surface-700">{{ data.email }}</span>
                <span v-else class="text-surface-400 italic">—</span>
              </template>
            </Column>

            <Column field="full_name" header="Name" sortable>
              <template #body="{ data }">
                <span v-if="data.first_name || data.last_name">
                  {{ `${data.first_name || ''} ${data.last_name || ''}`.trim() }}
                </span>
                <span v-else class="text-surface-400 italic">—</span>
              </template>
            </Column>

            <Column header="Roles">
              <template #body="{ data }">
                <div class="flex gap-1 flex-wrap">
                  <Tag
                    v-for="role in (data.roles || [])"
                    :key="role.id || role.name || role"
                    :value="role.name || role"
                    :severity="getTagSeverity(role.name || role)"
                    rounded
                  />
                  <span v-if="!(data.roles || []).length" class="text-surface-400 italic">—</span>
                </div>
              </template>
            </Column>

            <Column field="date_joined" header="Created" sortable>
              <template #body="{ data }">
                <span class="text-surface-600">{{ formatDate(data.date_joined) }}</span>
              </template>
            </Column>

            <Column field="is_active" header="Status">
              <template #body="{ data }">
                <Tag
                  :value="data.is_active ? 'Active' : 'Inactive'"
                  :severity="data.is_active ? 'success' : 'danger'"
                  rounded
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
  <Toast position="top-center" />
</template>

<script setup>
import { useUserStore } from "~/stores/UserStore";

definePageMeta({
  layout: 'peg',
});

const userStore = useUserStore();

const users = ref([]);
const loading = ref(false);
const loadError = ref(null);

function getTagSeverity(role) {
  switch (String(role).toLowerCase()) {
    case 'peg-reviewer':
    case 'reviewer':
      return 'info';
    case 'peg-uploader':
    case 'uploader':
      return 'success';
    case 'peg-admin':
    case 'admin':
      return 'danger';
    default:
      return 'secondary';
  }
}

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return '—';
  }
}

async function loadUsers() {
  if (!userStore.canReviewPEG()) return;
  loading.value = true;
  loadError.value = null;
  try {
    users.value = await userStore.getPEGUsers();
  } catch (error) {
    console.error('Error loading PEG users:', error);
    if (error?.response?.status === 403) {
      loadError.value = 'You do not have permission to list PEG users.';
    } else {
      loadError.value = 'Failed to load users. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadUsers);
</script>
