import Vue from 'vue'

const APP_ERROR = 'app-error'
const JSON_PARSE_ERROR = 'parse-error'
const NETWORK_ERROR = 'network-error'
const INVALID_REQUEST_ERROR = 'invalid-request-error'
const ILLEGAL_STATE_ERROR = 'illegal-state-error'

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

function errorEmitter (vm: Vue, e: Error): void {
  let wrappedErr = e
  if (e instanceof TypeError) {
    wrappedErr = new NetworkError(e.message)
  } else if (e instanceof SyntaxError) {
    wrappedErr = new JSONParseError(e.message)
  }

  vm.$emit(APP_ERROR, wrappedErr)
}

export {
  InvalidRequestError,
  IllegalStateError
}

export {
  errorEmitter
}
