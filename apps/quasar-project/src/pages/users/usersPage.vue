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
import type { ApiInputType, ApiOutputType } from '@projeto/crud-api';
import { useQuasar, type QTableColumn, QSpinnerHourglass } from 'quasar';
import UsersFormModal from './usersFormModal.vue';

const $q = useQuasar();
const crudApi = useAPi();
const loading = ref(false);
const response = ref<ApiOutputType['user']['list']>();

const loadData = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerHourglass,
      message: 'Carregando informações...',
    });

    response.value = await crudApi.user.list.query({
      orderByAsc: true,
      orderColumn: 'name',
      page: 0,
      pageSize: 10,
      search: '',
    });
  } catch {
    $q.dialog({
      title: 'Ocorreu um erro',
      message: 'Um erro interno ocorreu carregando as informações, tente novamente mais tarde.',
      color: 'negative',
    });
  } finally {
    $q.loading.hide();
  }
};

const add = () => {
  $q.dialog({
    component: UsersFormModal,
  }).onDismiss(() => {
    void loadData();
  });
};

const edit = (id: ApiInputType['user']['get']['id']) => {
  $q.dialog({
    component: UsersFormModal,
    componentProps: {
      id,
    },
  }).onDismiss(() => {
    void loadData();
  });
};

const remove = async (id: ApiInputType['user']['delete']['id']) => {
  try{
    await crudApi.user.delete.mutate({ id });
    await loadData();
  }
  catch {
    $q.dialog({
      title: 'Ocorreu um erro',
      message:
        'Um erro interno ocorreu carregando as informações, tente novamente mais tarde.',
      color: 'negative',
    });
  }
  finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  void loadData();
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
    name: 'name',
    label: 'Nome',
    field: (row: ApiOutputType['user']['list']['data'][0]) => row.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Email',
    field: (row: ApiOutputType['user']['list']['data'][0]) => row.email,
    align: 'left',
    sortable: true,
  },
];
</script>
