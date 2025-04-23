<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div class="row full-width">
      <div class="col-12 row justify-end q-mb-sm">
        <q-btn push color="green-5" label="Adicionar" icon="mdi-plus" @click="add" />
      </div>
      <div class="col-12">
        <q-table class="" :rows="response?.data || []" :columns="columns" :loading="loading">
          <template v-slot:body-cell-actions="props">
            <q-td key="actions" :props="props" class="q-gutter-sm">
              <q-btn
                icon="mdi-pencil"
                color="green"
                no-caps
                dense
                outline
                padding="6px"
                size="md"
                @click="() => edit(props.row.id)"
              >
                <q-tooltip> Editar </q-tooltip>
              </q-btn>

              <q-btn
                icon="mdi-trash-can"
                color="red"
                no-caps
                dense
                outline
                padding="6px"
                size="md"
                @click="() => remove(props.row.id)"
              >
                <q-tooltip> Remover </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAPi } from 'src/composables/useApi';
import type { ApiOutputType } from '@projeto/crud-api';
import { useQuasar, type QTableColumn } from 'quasar';
import UsersFormModal from './usersFormModal.vue';

const crudApi = useAPi();
const loading = ref(false);
const response = ref<ApiOutputType['user']['list']>();

const loadData = async () => {
  response.value = await crudApi.user.list.query();
};

const $q = useQuasar();

const add = () => {
  $q.dialog({
    component: UsersFormModal,
  }).onDismiss(async () => {
    await loadData();
  });
};

const edit = (id: number) => {
  $q.dialog({
    component: UsersFormModal,
    componentProps: {
      id,
    },
  }).onDismiss(async () => {
    await loadData();
  });
};

const remove = async (id: number) => {
  await crudApi.user.delete.mutate({ id });
  await loadData();
};

onMounted(async () => {
  await loadData();
});

const columns: QTableColumn[] = [
  {
    name: 'actions',
    required: true,
    label: 'Ações',
    align: 'center',
    field: () => '',
    sortable: false,
    style: () => {
      return 'width: 150px';
    },
  },
  {
    name: 'id',
    label: 'Id',
    field: (row: ApiOutputType['user']['list']['data'][0]) => row.id,
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Nome',
    field: (row: ApiOutputType['user']['list']['data'][0]) => row.nome,
    align: 'left',
    sortable: true,
  },
];
</script>
