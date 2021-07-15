<template>
  <div class="todo-list">
    <p v-show="loading" class="loading">{{ text.LOADING }}</p>
    <form>
      <input type="search" id="search-box" v-model="keyword" :title="text.SERACH_TODO_HERE" :placeholder="text.SERACH_TODO_HERE">
      <button id="search-button" @click.prevent="refreshList">{{ text.SEARCH }}</button>
      <button type="reset" @click.prevent="keyword = ''">{{ text.CLEAR }}</button>
    </form>
    <div class="function">
      <button id="refresh-button" @click="refreshList">{{ text.REFRESH }}</button>
      <button @click="addTodo">{{ text.ADD_TODO }}</button>
    </div>
    <template v-if="todos.length > 0">
      <ul>
        <todo-item v-for="(todo, i) of todos"
        :key="todo.Id"
        :initialTodo.sync="todos[i]"
        @delete-item="removeTodo(i)"
        @modify-item="modifyTodoByIndex(i)"
        @open-options="openOptions(i)"
        ></todo-item>
      </ul>
    </template>
    <template v-else>
      <p>{{ text.LIST_IS_EMPTY }}</p>
    </template>
    <transition name="pop">
      <template v-if="currentTodoI !== -1 && showOptions">
        <item-option
        :initialTodo.sync="todos[currentTodoI]"
        @change="modifyTodoByIndex(currentTodoI)"
        @close-options="closeOptions"
        id="item-option"
        ></item-option>
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TodoItem from './TodoItem.vue'
import ItemOption from './ItemOption.vue'
import { getTodos, getTodoById, sendAddRequest, sendModifyRequest, sendDeleteRequest } from '../util/TodoRequest'
import { IllegalStateError, messageEmitter } from '../util/AppMessage'
import { Todo, TodoPartial } from '../Todo/Todo'
import APPTEXT from '../assets/todolist.json'

type Data = { text: Record<string, string>, todos: Todo[], loading: boolean, keyword: string, currentTodoI: number, showOptions: boolean }
export default Vue.extend({
  components: {
    TodoItem,
    ItemOption
  },
  data: function (): Data {
    return {
      text: APPTEXT,
      todos: [],
      loading: false,
      keyword: '',
      currentTodoI: -1,
      showOptions: false
    }
  },
  methods: {
    refreshList: async function () {
      this.loading = true
      try {
        if (this.keyword === '') {
          this.todos = await getTodos()
        } else {
          this.todos = await getTodos('keyword', this.keyword)
        }
      } catch (e) {
        messageEmitter(this, e)
      } finally {
        this.loading = false
      }
    },
    addTodo: async function () {
      const Content = prompt('Todo Content:', '')
      if (Content === null) {
        return
      }
      const todoPartial: TodoPartial = { Content }
      try {
        const location = await sendAddRequest(todoPartial)
        const id = +(location.match(/(?<=\/)\d+$/) as [string])[0]
        const createdTodo = await getTodoById(id)
        this.todos.push(createdTodo)
      } catch (e) {
        messageEmitter(this, e)
      }
    },
    removeTodo: async function (i: number) {
      const id = this.todos[i].Id
      try {
        const replied = await sendDeleteRequest(id)
        if (id === replied) {
          this.todos.splice(i, 1)
          messageEmitter(this, APPTEXT.DELETE_OK)
        } else {
          throw new IllegalStateError(`Illegal state. Tried to delete ${id}, but got ${replied}.`)
        }
      } catch (e) {
        messageEmitter(this, e)
      }
    },
    modifyTodoByIndex (i: number) {
      this.modifyTodo(this.todos[i])
    },
    modifyTodo: async function (todo: Todo) {
      const modifiedTodo = todo
      const id = modifiedTodo.Id
      try {
        const location = await sendModifyRequest(id, modifiedTodo)
        const replied = +(location.match(/(?<=\/)\d+$/) as string[])[0]
        if (id === replied) {
          messageEmitter(this, APPTEXT.MODIFY_OK)
        } else {
          throw new IllegalStateError(`Illegal state. Tried to modify ${id}, but got ${replied}.`)
        }
      } catch (e) {
        messageEmitter(this, e)
      }
    },
    openOptions (i: number) {
      this.currentTodoI = i
      // TODO: show options
      this.showOptions = true
    },
    closeOptions () {
      this.showOptions = false
      console.log('options should be close.')
    }
  },
  created: function () {
    this.refreshList()
      .catch(e => messageEmitter(this, e))
  }
})
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}
#item-option {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.pop-enter-active {
  transition: transform 300ms cubic-bezier(.62,.43,.26,.9);
}
.pop-leave-active {
  transition: transform 300ms cubic-bezier(.48,.15,.33,.71);
}
.pop-enter-to {
  transform: translate(0, 0);
}
.pop-enter, .pop-leave-to {
  transform: translate(0, 100%);
}
</style>
