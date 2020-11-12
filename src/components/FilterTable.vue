<template>
    <div>
        <div
            v-show="items.length > 0"
            class="my-4 flex justify-between md:items-center flex-col md:flex-row"
        >
            <div class="flex-1 md:pr-4">
                <div class="relative md:w-1/3 mb-4 md:mb-0">
                    <input
                        type="search"
                        class="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium"
                        placeholder="Hledat"
                        v-model="searchTermProxy"
                    />
                    <div
                        class="absolute top-0 left-0 inline-flex items-center p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 text-gray-400"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                                stroke="none"
                            ></rect>
                            <circle cx="10" cy="10" r="7"></circle>
                            <line x1="21" y1="21" x2="15" y2="15"></line>
                        </svg>
                    </div>
                </div>
            </div>
            <div>
                <nav
                    class="inline-flex"
                    role="navigation"
                    aria-label="pagination"
                >
                    <button
                        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                        :class="{
                            'cursor-not-allowed opacity-50':
                                pagination.currentPage <= 1,
                        }"
                        aria-label="Předchozí stránka"
                        @click="pagination.currentPage--"
                        :disabled="pagination.currentPage <= 1"
                    >
                        &laquo;
                    </button>
                    <button
                        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                        :class="{
                            'cursor-not-allowed opacity-50':
                                pagination.currentPage >= pagesCount,
                        }"
                        aria-label="Další stránka"
                        @click="pagination.currentPage++"
                        :disabled="pagination.currentPage >= pagesCount"
                    >
                        &raquo;
                    </button>
                </nav>
                <span class="ml-3"
                    >s. {{ pagination.currentPage }}/{{ pagesCount }}</span
                >
            </div>
        </div>
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
                                v-for="item in filteredItems.slice(
                                    currentItems.start,
                                    currentItems.end
                                )"
                                :key="item.id"
                                class="even:bg-gray-100 hover:bg-purple-200"
                            >
                                <td
                                    class="px-6 py-4 text-sm leading-5 text-gray-800"
                                >
                                    {{ item.title }}
                                </td>
                                <td
                                    class="px-6 py-4 text-sm leading-5 text-gray-800"
                                >
                                    {{ item.author }}
                                </td>
                                <td
                                    class="px-6 py-4 text-sm leading-5 text-gray-800"
                                >
                                    {{ item.genre }}
                                </td>
                                <td
                                    class="px-6 py-4 text-sm leading-5 text-gray-800"
                                >
                                    {{ item.id }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-show="items.length > 0" class="my-2">
            Celkový počet záznamů: {{ items.length }}, zobrazeno:
            {{ filteredItems.length }}
        </div>
        <LoadingIndicator v-show="loading" />
        <AlertMessage v-show="error.length > 0" :message="error" />
    </div>
</template>

<script>
import axios from 'axios'
import { debounce, deburr, includes, some } from 'lodash'
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
            awaitingSearch: false,
            columns: ['Název', 'Autor', 'Žánr', 'Inv. číslo'],
            error: [],
            items: [],
            loading: false,
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
            },
            searchTerm: '',
            searchTermProxy: '', // proxy for debouncing
        }
    },
    computed: {
        filteredItems() {
            const query = this.normalize(this.searchTerm)
            return this.items.filter(item => {
                // find a partial string in any property value of an object
                return some(item, val => {
                    return includes(this.normalize(val), query)
                })
            })
        },

        pagesCount: function() {
            return Math.ceil(
                this.filteredItems.length / this.pagination.itemsPerPage
            )
        },

        currentItems: function() {
            let firstItem = this.pagination.currentPage - 1
            firstItem = firstItem * this.pagination.itemsPerPage

            return {
                start: firstItem,
                end: firstItem + this.pagination.itemsPerPage,
            }
        },
    },
    mounted: function() {
        this.getData()
    },
    methods: {
        getData: function() {
            const self = this
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

        normalize: function(str) {
            return deburr(
                str
                    .toString()
                    .trim()
                    .toLowerCase()
            )
        },
    },
    watch: {
        searchTermProxy: debounce(function(newVal) {
            this.pagination.currentPage = 1
            this.searchTerm = newVal
        }, 500),
    },
}
</script>
