<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>Главная</h1>
          <v-btn  class="success mb-3" @click="clearLocalStorage()">
              Очистить локальное хранилище
          </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  methods: {
    clearLocalStorage () {
      if (confirm('Вы уверены что хотите очистить хранилище? Оперецию отменить нельзя!!!')) {
        localStorage.clear()
      }
    }
  }
}
</script>
<style lang="scss" scoped
</style>
