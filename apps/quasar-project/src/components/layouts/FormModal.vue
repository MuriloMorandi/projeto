<template>
    <q-card class="q-dialog-plugin" :style="`min-width:${minWidth[$q.screen.name]}`">
      <q-form @submit="handleSubmit">
        <q-card-actions>
          <q-toolbar>
            <q-avatar>
              <q-icon name="mdi-plus" size="sm" />
            </q-avatar>
            <q-separator dark vertical inset />
            <q-toolbar-title>{{props.title}}</q-toolbar-title>

            <q-btn
              v-if="!create"
              label="Remover"
              color="negative"
              class="q-mx-sm"
              @click="onClickRemove"
            />
            <q-btn
              :label="props.create ? 'Cadastrar' : 'Salvar Alterações'"
              color="positive"
              class="q-mx-sm"
              type="submit"
            />
            <q-btn
              class="q-mx-sm"
              outline
              icon="close"
              @click="onClickClose"
            />
          </q-toolbar>
        </q-card-actions>
        <q-card-section class="row">
          <slot name="conteudo"></slot>
        </q-card-section>
      </q-form>
    </q-card>
</template>

<script setup lang="ts">
import { QForm, useDialogPluginComponent } from 'quasar';

const emit = defineEmits(['create', 'update', 'remove', 'close', ...useDialogPluginComponent.emits]);

const props = defineProps<{
  create: boolean;
  title: string;
}>();

const minWidth = {
  xs: 'unset',
  sm: '85vw',
  md: '70vw',
  lg: '60vw',
  xl: '55vw',
};


const handleSubmit = () => {
  if (props.create) {
    emit('create');
  } else {
    emit('update');
  }
};

const onClickRemove = () => {
  emit('remove');
};

const onClickClose = ()=>{
  emit('close');
}

</script>


