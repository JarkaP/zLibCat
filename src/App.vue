<template>
    <div id="app" class="h-screen bg-gray-300 flex flex-col">
        <header class="bg-white shadow px-4 sm:px-6 lg:px-8">
            <div class="max-w-6xl mx-auto py-6 ">
                <h1
                    class="text-3xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                >
                    Seznam knih
                </h1>
            </div>
        </header>
        <main class="sm:px-6 lg:px-8 py-6">
            <div class="max-w-6xl mx-auto">
                <FilterTable />
            </div>
        </main>
        <footer class="mt-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="max-w-6xl mx-auto">
                {{ new Date().getFullYear() }}
            </div>
        </footer>
    </div>
</template>

<script>
import FilterTable from './components/FilterTable.vue'

export default {
    name: 'App',
    components: {
        FilterTable,
    },
}
</script>

<style src="./assets/styles/index.css"></style>
