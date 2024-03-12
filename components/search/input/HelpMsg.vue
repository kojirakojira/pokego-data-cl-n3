<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-icon v-bind="props" size="small">
        mdi-help-circle
      </v-icon>
    </template>
    <span><slot /></span>
  </v-tooltip>
</template>
