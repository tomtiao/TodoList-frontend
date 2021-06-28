<template>
  <div id="app">
    <app-toast v-show="messageObject.message" :messageObject="messageObject"></app-toast>
    <todo-list @app-error="handleAppError" @app-message="handleAppMessage"></todo-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppToast from './components/AppToast.vue'
import TodoList from './components/TodoList.vue'
import { IllegalStateError } from './util/AppError'
import { Info } from './util/AppMessage'
const showTimeout = 5000
export default Vue.extend({
  name: 'App',
  components: {
    TodoList,
    AppToast
  },
  data: function () {
    return {
      messageObject: {
        message: '',
        error: false
      }
    }
  },
  methods: {
    handleAppError: function (e: Error) {
      this.messageObject = {
        message: e.message,
        error: true
      }
      setTimeout(() => {
        this.messageObject = {
          message: '',
          error: false
        }
      }, showTimeout)
      if (e instanceof IllegalStateError) {
        throw e
      }
    },
    handleAppMessage: function (info: Info) {
      this.messageObject = {
        message: info,
        error: false
      }
      setTimeout(() => {
        this.messageObject = {
          message: '',
          error: false
        }
      }, showTimeout)
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto 0 auto;
  max-width: 1300px;
}
</style>
