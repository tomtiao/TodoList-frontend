<template>
  <div class="item-option">
    <div class="header">
      <button class="cancel-btn" @click="cancelModify">{{ text.cancel }}</button>
      <h2 class="option-title">{{ text.optionTitle }}</h2>
      <button class="confirm-btn" @click="confirmModify">{{ text.confirm }}</button>
    </div>
    <div class="content-section">
      <input type="text" id="content-field" v-model="todo.Content">
      <input type="text" id="note-field" v-model="todo.Note" :placeholder="text.note">
    </div>
    <div class="reminder-section">
      <label>
        {{ text.reminder }}
        <input type="checkbox" id="reminder-option"
        v-model="reminder"
        @change="changeReminder">
      </label>
      <date-time-picker
      v-show="reminder"
      :initialTimestamp.sync="todo.ReminderTime"
      ></date-time-picker>
    </div>
    <div class="flag-section">
      <label :for="`flag${todo.Id}`">
        {{ text.flag }}
        <input type="checkbox"
        :id="`flag${todo.Id}`"
        v-model="todo.Flagged"
        >
      </label>
    </div>
    <div class="priority-section">
      <label :for="`priority${todo.Id}`">
        {{ text.priority }}
        <select :id="`priority${todo.Id}`" v-model="todo.Priority">
          <option
          v-for="option of priorityOptions"
          :key="option.value"
          :value="option.value"
          >{{ option.text }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import DateTimePicker from './DateTimePicker.vue'
import ITEMTEXT from '../assets/todoitem.json'
import { Todo } from '@/Todo/Todo'
export default Vue.extend({
  components: {
    DateTimePicker
  },
  props: {
    initialTodo: {
      type: Object as PropType<Todo>,
      required: true
    }
  },
  data: function () {
    return {
      text: ITEMTEXT,
      todo: { ...this.initialTodo },
      oldTodo: { ...this.initialTodo },
      priorityOptions: [
        { value: 0, text: ITEMTEXT.none },
        { value: 1, text: ITEMTEXT.low },
        { value: 2, text: ITEMTEXT.medium },
        { value: 3, text: ITEMTEXT.high }
      ],
      reminder: this.initialTodo.ReminderTime !== null
    }
  },
  methods: {
    modifyTodo (): void {
      if (this.isModified) {
        this.$emit('update:initialTodo', this.todo)
        this.oldTodo = { ...this.todo }
        this.$emit('change')
      }
    },
    changeReminder () {
      if (this.reminder) {
        this.todo.ReminderTime = Date.now()
      } else {
        this.todo.ReminderTime = null
      }
    },
    confirmModify () {
      this.modifyTodo()
      this.$emit('close-options')
    },
    cancelModify () {
      this.todo = { ...this.initialTodo }
      this.oldTodo = { ...this.initialTodo }
      this.$emit('close-options')
    }
  },
  computed: {
    isModified: function (): boolean {
      return Object.keys(this.oldTodo).some(k => this.oldTodo[k as keyof Todo] !== this.todo[k as keyof Todo])
    }
  },
  watch: {
    initialTodo: function (newVal) { // update the internal todo when the prop initialTodo changes
      this.todo = { ...newVal } // newVal is passed by reference on objects so need a copied object here
      this.reminder = this.todo.ReminderTime !== null
    }
  }
})
</script>

<style scoped>
.item-option {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
  background-color: #eee;
}
.header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.content-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: flex-start;
}
.reminder-section {
  display: flex;
  flex-direction: column;
}
.priority-section>label {
  display: flex;
  justify-content: space-between;
}
</style>
