<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-form ref="formRef" @submit="submitForm">
      <q-card class="q-dialog-plugin" :style="`min-width:${minWidth[$q.screen.name]}`">
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
                @click="remove(props.id)"
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
              v-model.trim="data.nome"
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

        <q-card-section class="bg-grey-2 q-pa-md"> </q-card-section>
      </q-card>
    </q-form>
  </q-dialog>
</template>
<script setup lang="ts">
import { QForm, useDialogPluginComponent, useQuasar } from 'quasar';
import ResponsiveCol from 'components/layouts/ResponsiveCol.vue';
import { onMounted, ref } from 'vue';
import { z } from 'zod';
import { useAPi } from 'src/composables/useApi';
import { ApiOutputType } from '@projeto/crud-api';

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
const props = defineProps<{ id?: number }>();

const data = ref<NonNullable<ApiOutputType['user']['get']>>({
  id: 0,
  email: '',
  nome: '',
});

const emailValid = (val: string) => z.string().email().safeParse(val).success;

const loadData = async () => {
  try {
    if (!props.id) {
      throw new Error('Id is missing');
    }

    const user = await crudApi.user.get.query({ id: props.id });

    data.value = user;
  } catch (error) {
    console.log(error);
  }
};

const submitForm = () => {
  formRef.value?.submit();
};

const create = async () => {
  await crudApi.user.create.mutate({
    email: data.value?.email || '',
    nome: data.value?.nome || '',
  });

  onDialogOK();
};

const remove = async (id: number) => {
  await crudApi.user.delete.mutate({ id });
  onDialogOK();
};

const submit = () => {
  if (props.id) {
    return;
  } else {
    create();
  }
};

onMounted(() => {
  if (props.id) {
    loadData();
  }
});
</script>
