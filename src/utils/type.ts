export type Changer<T> = T | ((nextT: T) => T)

export type History<T> = { current: T; last: T }
