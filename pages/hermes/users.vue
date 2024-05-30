<script setup>
import { useUserStore } from '~/stores/UserStore';
const store = useUserStore();
const users = ref([]);

onMounted(async () => {
  users.value = await store.getHermesUsers();
});


</script>

<template>
  <DataTable :value="users" :paginator="false" row-hover sort-field="user_name">
    <Column field="user_name" header="User"></Column>
    <Column field="last_login" header="Last Login"></Column>
    <Column field="created_at" header="Created At">
      <template #body="{ data }">
        {{ formatDate(new Date(data.created_at)) }}
      </template>
    </Column>
    <Column field="role" header="Role"></Column>
  </DataTable>
</template>

<style scoped>

</style>
