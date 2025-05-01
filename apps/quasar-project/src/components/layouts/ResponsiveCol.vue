<template>
  <template v-if="isMobile">
    <div class="flex full-width row q-pa-sm">
      <slot />
    </div>
  </template>
  <template v-else>
    <div
      class="flex row q-pa-sm"
      :class="`col-${col || 12} ${offset && `offset-${offset | 0}`}`"
    >
      <slot />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();

defineProps<{
  col?: number;
  offset?: number;
}>();

const isMobile = computed(() => {
  return $q.screen.lt.md;
});
</script>
