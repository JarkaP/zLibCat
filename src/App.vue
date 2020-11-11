<template>
    <div id="app">
        <HelloWorld msg="Welcome" />
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld,
    },
}
</script>

<style src="./assets/styles/index.css"></style>
