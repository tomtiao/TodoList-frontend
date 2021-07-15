<template>
  <li class="todo-item"
    @focusin="onfocusin"
    @focusout="onfocusout"
    >
    <div class="indicator-section">
      <input
      type="checkbox"
      name="completed"
      class="completed"
      v-model="todo.Completed"
      :title="completedTitle"
      @change="modifyTodo"
      />
      <span v-if="todo.Flagged" class="flag">{{ flagIcon }}</span>
    </div>
    <div class="content-section">
      <input
      class="content"
      type="text"
      v-model="todo.Content"
      :title="todo.Content"
      />
      <p class="reminder-time" v-if="hasReminder">{{ reminderTime }}</p>
      <input
        v-show="todo.Note || focused"
        class="note"
        type="text"
        v-model="todo.Note"
        :title="todo.Note"
        :placeholder="notePlaceholder"
      />
    </div>
    <div class="button-section">
      <button class="more-button" v-show="focused" @click="showOptions">ℹ</button>
      <button class="delete-button" v-show="focused" @click="deleteItem">×</button>
    </div>
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Todo } from '../Todo/Todo'
import ITEMTEXT from '../assets/todoitem.json'
export default Vue.extend({
  props: {
    initialTodo: {
      type: Object as PropType<Todo>,
      required: true
    }
  },
  data: function () {
    return {
      todo: { ...this.initialTodo },
      oldTodo: { ...this.initialTodo },
      focused: false
    }
  },
  methods: {
    modifyTodo: function (): void {
      if (this.isModified) {
        this.$emit('update:initialTodo', this.todo)
        this.oldTodo = { ...this.todo }
        this.$emit('modify-item')
      }
    },
    deleteItem: function (): void {
      this.$emit('delete-item')
    },
    showOptions: function () {
      this.$emit('open-options')
    },
    onfocusin: function () {
      setTimeout(() => {
        this.focused = true
      })
    },
    onfocusout: function () {
      this.modifyTodo()
      setTimeout(() => {
        this.focused = false
      })
    }
  },
  computed: {
    completedTitle: function (): string {
      return this.todo.Completed ? ITEMTEXT.completed : ITEMTEXT.uncompleted
    },
    flagIcon: function (): string {
      return this.todo.Flagged ? ITEMTEXT.flagIcon : ''
    },
    isModified: function (): boolean {
      return Object.keys(this.oldTodo).some(k => this.oldTodo[k as keyof Todo] !== this.todo[k as keyof Todo])
    },
    hasReminder: function () : boolean {
      return this.todo.ReminderTime !== null
    },
    reminderTime: function (): string {
      return this.hasReminder ? new Intl.DateTimeFormat(undefined,
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
        .format(new Date(this.todo.ReminderTime as number))
        : ''
    },
    notePlaceholder: function (): string {
      return this.todo.Note ? '' : ITEMTEXT.note
    }
  },
  watch: {
    initialTodo: function (newVal) { // update the internal todo when the prop initialTodo changes
      this.todo = { ...newVal } // newVal is passed by reference on objects so need a copied object here
    }
  }
})
</script>

<style scoped>
li {
  display: flex;
  margin: 1em 0em;
  padding: 0 1rem;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  background-color: white;
}
.indicator-section {
  display: flex;
  width: 5%;
}
.content-section {
  display: flex;
  min-width: 80%;
  margin-left: 1rem;
  flex-direction: column;
  justify-content: center;
  align-content: flex-start;
}
input[type=text] {
  border: 0;
  padding: 0;
  margin: 0.5rem 0;
  background-color: transparent;
}
input[type=text]:first-child {
  margin-top: 0;
}
.content {
  display: inline-block;
  font-size: 1.5rem;
}
.note {
  color: #999;
  font-size: 1rem;
}
.reminder-time {
  color: #999;
  margin: 0.125rem 0;
  font-size: 1.25rem;
  text-align: left;
}
.button-section {
  display: flex;
  margin-left: auto; /* Put self to the end of the main axis */
  justify-content: center;
  align-content: center;
}
.reminder-time {
  background-color: white;
}
</style>
