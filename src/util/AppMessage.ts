import Vue from 'vue'

type Info = string

const APP_ERROR = 'app-error'
const JSON_PARSE_ERROR = 'parse-error'
const NETWORK_ERROR = 'network-error'
const INVALID_REQUEST_ERROR = 'invalid-request-error'
const ILLEGAL_STATE_ERROR = 'illegal-state-error'
const NOT_FOUND_ERROR = 'not-found-error'
const APP_MESSAGE = 'app-message'

class JSONParseError extends SyntaxError {
  constructor (message: string = JSON_PARSE_ERROR) {
    super(message)
    this.name = this.constructor.name
  }
}

class NetworkError extends TypeError {
  constructor (message: string = NETWORK_ERROR) {
    super(message)
    this.name = this.constructor.name
  }
}

class InvalidRequestError extends Error {
  constructor (message: string = INVALID_REQUEST_ERROR) {
    super(message)
    this.name = this.constructor.name
  }
}

class IllegalStateError extends Error {
  constructor (message: string = ILLEGAL_STATE_ERROR) {
    super(message)
    this.name = this.constructor.name
  }
}

class NotFoundError extends Error {
  constructor (message: string = NOT_FOUND_ERROR) {
    super(message)
    this.name = this.constructor.name
  }
}

function messageEmitter (vm: Vue, m: Info | Error): void {
  if (m instanceof Error) {
    let wrappedErr = m
    if (m instanceof TypeError) {
      wrappedErr = new NetworkError(m.message)
    } else if (m instanceof SyntaxError) {
      wrappedErr = new JSONParseError(m.message)
    }

    vm.$emit(APP_ERROR, wrappedErr)
  } else {
    vm.$emit(APP_MESSAGE, m)
  }
}

export {
  InvalidRequestError,
  IllegalStateError,
  NetworkError,
  NotFoundError,
  Info
}

export {
  messageEmitter
}
