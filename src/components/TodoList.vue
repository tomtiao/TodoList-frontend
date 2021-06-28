<template>
  <div class="todo-list">
    <p v-show="loading" class="loading">加载中……</p>
    <form>
      <input type="search" id="search-box" v-model="keyword" title="在这儿搜索待办事项" placeholder="在这儿搜索待办事项">
      <button id="search-button" @click.prevent="refreshList">搜索</button>
      <button type="reset" @click.prevent="keyword = ''">清空</button>
    </form>
    <div class="function">
      <button id="refresh-button" @click="refreshList">刷新</button>
      <button @click="addTodo">添加待办事项</button>
    </div>
    <template v-if="todos.length > 0">
      <ul>
        <todo-item v-for="(todo, index) of todos"
        :key="todo.Id"
        :todo="todo"
        @delete-item="removeTodo(index)"
        @modify-item="modifyTodo(index)"></todo-item>
      </ul>
    </template>
    <template v-else>
      <p>待办事项列表是空的</p>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TodoItem from './TodoItem.vue'
import { InvalidRequestError, IllegalStateError, errorEmitter } from '../util/AppError'
import { messageEmitter } from '../util/AppMessage'
import { Todo, TodoPartial } from '../Todo/Todo'
import APPTEXT from '../assets/todolist.json'

const TODO_API = '/todo'
async function getTodos (mode: 'all' | 'keyword' = 'all', kw?: string): Promise<Todo[]> {
  let requestURL = `${TODO_API}`
  if (mode === 'all') {
    requestURL = `${TODO_API}`
  } else if (mode === 'keyword') {
    requestURL = `${TODO_API}?kw=${kw}`
  }
  const res = await fetch(requestURL)
  if (res.ok) {
    const objects = await res.json()
    return objects
  } else {
    throw new InvalidRequestError(res.statusText)
  }
}
async function sendDeleteRequest (id: number): Promise<number> {
  const res = await fetch(`${TODO_API}/${id}`, { method: 'DELETE' })
  if (res.ok) {
    const replied = await res.json()
    return replied
  } else {
    throw new InvalidRequestError(res.statusText)
  }
}
async function sendAddRequest (todo: TodoPartial): Promise<string> {
  const res = await fetch(`${TODO_API}`, { method: 'POST', body: JSON.stringify(todo), headers: { 'content-type': 'application/json' } })
  if (res.ok) {
    return res.headers.get('Location') as string
  } else {
    throw new InvalidRequestError(res.statusText)
  }
}
async function getTodoById (id: number): Promise<Todo> {
  const res = await fetch(`${TODO_API}/${id}`)
  if (res.ok) {
    const todo = await res.json()
    return todo
  } else {
    throw new InvalidRequestError(res.statusText)
  }
}
async function sendModifyRequest (id: number, todo: TodoPartial): Promise<string> {
  const res = await fetch(`${TODO_API}/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(todo) })
  if (res.ok) {
    return res.headers.get('Content-Location') as string
  } else {
    throw new InvalidRequestError(res.statusText)
  }
}
export default Vue.extend({
  name: 'TodoList',
  components: { TodoItem },
  data: function (): { todos: Todo[], loading: boolean, keyword: string } {
    return {
      todos: [],
      loading: false,
      keyword: ''
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
        errorEmitter(this, e)
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
        errorEmitter(this, e)
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
        errorEmitter(this, e)
      }
    },
    modifyTodo: async function (i: number) {
      const modifiedTodo = this.todos[i]
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
        errorEmitter(this, e)
      }
    }
  },
  created: function () {
    try {
      this.refreshList()
    } catch (e) {
      errorEmitter(this, e)
    }
  }
})
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
