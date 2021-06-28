import Vue from 'vue'

type Info = string
const APP_MESSAGE = 'app-message'

function messageEmitter (vm: Vue, info: Info): void {
  vm.$emit(APP_MESSAGE, info)
}

export {
  Info
}

export {
  messageEmitter
}
