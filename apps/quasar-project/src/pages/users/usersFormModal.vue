<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <FormModal
      :title="`${!props.id ? 'Cadastro' : 'Edição'} de Usuários`"
      :create="!props.id"
      @create="create"
      @update="update"
      @remove="remove"
      @close="onDialogCancel"
    >
      <template #conteudo>
        <responsive-col :col="6">
          <q-input
            v-model.trim="data.name"
            label="Nome"
            outlined
            class="full-width"
            hide-bottom-space
            :rules="[(val) => !!val || 'Campo obrigatório']"
          >
            <template v-slot:append>
              <q-icon name="mdi-asterisk" color="negative" size="xs" />
            </template>
          </q-input>
        </responsive-col>

        <responsive-col :col="4" :offset="2">
          <q-input
            v-model="data.email"
            label="Email"
            outlined
            class="full-width"
            hide-bottom-space
            :rules="[
              (val) => !!val || 'Campo obrigatório',
              (val) => !val || emailValid(val) || 'E-mail Invalido',
            ]"
          >
            <template v-slot:append>
              <q-icon name="mdi-asterisk" color="negative" size="xs" />
            </template>
          </q-input>
        </responsive-col>
      </template>
    </FormModal>
  </q-dialog>
</template>
<script setup lang="ts">
import { QSpinnerHourglass, useDialogPluginComponent, useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { z } from 'zod';
import { useAPi } from 'src/composables/useApi';
import type { ApiInputType, ApiOutputType } from '@projeto/crud-api';
import FormModal from 'components/layouts/FormModal.vue';
import ResponsiveCol from 'components/layouts/ResponsiveCol.vue';

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const $q = useQuasar();
const crudApi = useAPi();

const props = defineProps<{ id?: ApiInputType['user']['get']['id'] }>();
const data = ref<NonNullable<ApiOutputType['user']['get']>>({
  id: '',
  email: '',
  name: '',
});

const emailValid = (val: string) => z.string().email().safeParse(val).success;

const loadData = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerHourglass,
      message: 'Carregando informações...',
    });

    if (props.id) {
      data.value = await crudApi.user.get.query({ id: props.id });
    }
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

const create = async () => {
  $q.loading.show({
    spinner: QSpinnerHourglass,
    message: 'Salvando...',
  });

  await crudApi.user.create.mutate({
    email: data.value?.email || '',
    name: data.value?.name || '',
  });

  $q.loading.hide();
  onDialogOK();
};

const update = async () => {
  try {
    if (!props.id) return;
    $q.loading.show({
      spinner: QSpinnerHourglass,
      message: 'Salvando Alterações...',
    });

    await crudApi.user.update.mutate({
      id: props.id,
      email: data.value?.email || '',
      name: data.value?.name || '',
    });

    $q.loading.hide();
    onDialogOK();
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

const remove = async () => {
  await crudApi.user.delete.mutate({ id: props?.id ?? '' });
  onDialogOK();
};

onMounted(() => {
  void loadData();
});
</script>
