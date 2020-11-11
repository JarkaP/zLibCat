<template>
    <div>
        <div v-show="items.length > 0" class="overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full">
                <div
                    class="shadow overflow-hidden border-b border-gray-300 rounded-lg"
                >
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th
                                    v-for="(column, index) in columns"
                                    :key="index"
                                    class="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    {{ column }}
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="bg-white divide-y divide-gray-300 divide-dashed"
                        >
                            <tr
                                v-for="item in items.slice(0, 5)"
                                :key="item.id"
                                class="even:bg-gray-100 hover:bg-purple-200"
                            >
                                <td
                                    class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-800"
                                >
                                    {{ item.title }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-800"
                                >
                                    {{ item.author }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-800"
                                >
                                    {{ item.genre }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-800"
                                >
                                    {{ item.id }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <LoadingIndicator v-show="loading" />
        <AlertMessage v-show="error.length > 0" :message="error" />
    </div>
</template>

<script>
import axios from 'axios'
import LoadingIndicator from './LoadingIndicator.vue'
import AlertMessage from './AlertMessage.vue'

export default {
    name: 'FilterTable',
    components: {
        AlertMessage,
        LoadingIndicator,
    },
    data() {
        return {
            columns: ['Název', 'Autor', 'Žánr', 'Inv. číslo'],
            error: [],
            items: [],
            loading: false,
        }
    },
    mounted: function() {
        this.getData()
    },
    methods: {
        getData: function() {
            let self = this
            self.loading = true
            axios
                .get('/data/data.json')
                .then(response => {
                    response.data.map(item => {
                        self.items.push({
                            author: `${item.last_name}, ${item.first_name}`,
                            genre: item.genre,
                            id: item.number,
                            title: item.title,
                        })
                    })
                })
                .catch(error => {
                    self.error.push(error.message)
                })
                .then(() => {
                    self.loading = false
                })
        },
    },
}
</script>
