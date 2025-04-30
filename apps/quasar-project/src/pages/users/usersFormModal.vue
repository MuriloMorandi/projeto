<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" :style="`min-width:${minWidth[$q.screen.name]}`">
      <q-form ref="formRef" @submit="submit">
        <q-card-actions class="bg-grey-2 text-black">
          <q-toolbar>
            <q-avatar>
              <q-icon name="mdi-plus" size="sm" />
            </q-avatar>

            <div>
              <p>Adicionar Usuarios</p>
            </div>
            <q-space />
            <div class="row no-wrap">
              <q-btn
                v-if="props.id"
                label="Apagar"
                color="negative"
                outline
                class="q-mx-sm"
                @click="remove"
              />

              <q-btn
                :label="props.id ? 'Salvar Alterações' : 'Cadastrar'"
                color="positive"
                class="q-mx-sm"
                @click="submitForm"
              />

              <q-btn
                @click="onDialogCancel"
                icon="mdi-close"
                color="grey-8"
                flat
                size="sm"
                class="q-mx-sm"
              />
            </div>
          </q-toolbar>
        </q-card-actions>

        <q-card-section tag="form" class="q-pt-none flex row">
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
        </q-card-section>

      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { QForm, QSpinnerHourglass, useDialogPluginComponent, useQuasar } from 'quasar';
import ResponsiveCol from 'components/layouts/ResponsiveCol.vue';
import { onMounted, ref } from 'vue';
import { z } from 'zod';
import { useAPi } from 'src/composables/useApi';
import type { ApiInputType, ApiOutputType } from '@projeto/crud-api';

const minWidth = {
  xs: 'unset',
  sm: '85vw',
  md: '70vw',
  lg: '60vw',
  xl: '55vw',
};

const $q = useQuasar();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const crudApi = useAPi();
const formRef = ref<QForm>();
defineEmits([...useDialogPluginComponent.emits]);

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

const submitForm = () => {
  formRef.value?.submit();
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

const submit = () => {
  if (props.id) {
    void update();
  } else {
    void create();
  }
};

onMounted(() => {
  void loadData();
});
</script>
