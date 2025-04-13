<template>
  <q-page class="row items-center justify-evenly">
    <q-table 
      :rows="response?.data || []" 
      :columns="columns" 
      :loading="loading"
      > 
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAPi } from 'src/composables/useApi';
import type { ApiOutputType } from '@projeto/crud-api';
import type { QTableColumn } from 'quasar';

const crudApi = useAPi();
const loading = ref(false);
const response = ref<ApiOutputType['user']['list']>();

const loadData = async () => {
  response.value = await crudApi.user.list.query();
};

onMounted(async () => {
  await loadData();
});

const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Nome',
    field: (row: ApiOutputType['user']['list']['data'][0]) => row.nome,
    align: 'left',
    sortable: true,
  },
];
</script>
