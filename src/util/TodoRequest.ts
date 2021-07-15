import { Todo, TodoPartial } from '../Todo/Todo'
import { InvalidRequestError, NetworkError, NotFoundError } from '../util/AppMessage'

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
    throw new NetworkError(res.statusText)
  }
}
async function sendDeleteRequest (id: number): Promise<number> {
  const res = await fetch(`${TODO_API}/${id}`, { method: 'DELETE' })
  if (res.ok) {
    const replied = await res.json()
    return replied
  } else {
    if (res.status === 400) {
      throw new InvalidRequestError(res.statusText)
    } else if (res.status === 404) {
      throw new NotFoundError(res.statusText)
    } else {
      throw new NetworkError(res.statusText)
    }
  }
}
async function sendAddRequest (todo: TodoPartial): Promise<string> {
  const res = await fetch(`${TODO_API}`, { method: 'POST', body: JSON.stringify(todo), headers: { 'content-type': 'application/json' } })
  if (res.ok) {
    return res.headers.get('Location') as string
  } else {
    if (res.status === 400) {
      throw new InvalidRequestError(res.statusText)
    } else {
      throw new NetworkError(res.statusText)
    }
  }
}
async function getTodoById (id: number): Promise<Todo> {
  const res = await fetch(`${TODO_API}/${id}`)
  if (res.ok) {
    const todo = await res.json()
    return todo
  } else {
    if (res.status === 400) {
      throw new InvalidRequestError(res.statusText)
    } else if (res.status === 404) {
      throw new NotFoundError(res.statusText)
    } else {
      throw new NetworkError(res.statusText)
    }
  }
}
async function sendModifyRequest (id: number, todo: TodoPartial): Promise<string> {
  const res = await fetch(`${TODO_API}/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(todo) })
  if (res.ok) {
    return res.headers.get('Content-Location') as string
  } else {
    if (res.status === 400) {
      throw new InvalidRequestError(res.statusText)
    } else if (res.status === 404) {
      throw new NotFoundError(res.statusText)
    } else {
      throw new NetworkError(res.statusText)
    }
  }
}

export {
  getTodos,
  getTodoById,
  sendAddRequest,
  sendDeleteRequest,
  sendModifyRequest
}
