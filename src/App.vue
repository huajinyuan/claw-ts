<template>
  <div id="app">
    <Designer />
  </div>
</template>

<script>
import Designer from './components/Designer.vue'

export default {
  name: 'App',
  components: {
    Designer
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>