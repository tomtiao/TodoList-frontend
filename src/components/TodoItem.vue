<template>
  <li class="todo-item">
    <input
      type="checkbox"
      name="completed"
      class="completed"
      v-model="todo.Completed"
      :title="completedTitle"
      @change="modifyTodo"
    />
    <span v-if="todo.Flagged" class="flag">{{ flagIcon }}</span>
    <input
      class="content"
      type="text"
      v-model="todo.Content"
      :title="todo.Content"
      @blur="modifyTodo"
    />
    <input
      v-if="todo.Note"
      class="note"
      type="text"
      v-model="todo.Note"
      :title="todo.Note"
    />
    <button class="delete-button" @click="deleteItem">×</button>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import { Todo } from '../Todo/Todo'
export default Vue.extend({
  props: {
    todo: {
      type: Object,
      required: true,
      default: function (): Todo {
        return {
          Id: 0,
          Content: '',
          Note: null,
          CreationTime: 0,
          ReminderTime: null,
          Priority: 0,
          Flagged: false,
          Completed: false
        }
      }
    }
  },
  data: function () {
    return {
      oldTodo: { ...this.todo }
    }
  },
  methods: {
    modifyTodo: function (): void {
      if (this.isModified) {
        this.$emit('modify-item', this.todo.id)
        this.oldTodo = { ...this.todo }
      }
    },
    deleteItem: function (): void {
      this.$emit('delete-item', this.todo.Id)
    }
  },
  computed: {
    completedTitle: function (): string {
      return this.todo.Completed ? '已完成' : '未完成'
    },
    flagIcon: function (): string {
      return this.todo.Flagged ? '🚩' : ''
    },
    isModified: function (): boolean {
      return Object.keys(this.oldTodo).some(k => this.oldTodo[k] !== this.todo[k])
    }
  }
})
</script>

<style scoped>
li {
  background-color: #eee;
}
.content {
  display: inline-block;
}
.delete-button {
  opacity: 0;
  pointer-events: none;
  transition: 66ms ease-in opacity;
}
li:hover > .delete-button {
  opacity: 1;
  pointer-events: all;
}
</style>
