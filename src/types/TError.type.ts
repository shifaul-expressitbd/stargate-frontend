class TError<T = unknown> extends Error {
  status: number
  success: boolean
  data?: T
  errors?: Array<{ path: string; message: string }>
  message: string
  constructor (
    status: number = 500,
    message: string = '',
    options: {
      data?: T
      errors?: Array<{ path: string; message: string }>
      success?: boolean
    } = {}
  ) {
    // No message in super() since we don't want it in the output
    super(message)
    this.status = status
    this.success = options.success ?? false
    this.data = options.data
    this.errors = options.errors
    this.message = message

    Object.setPrototypeOf(this, new.target.prototype)
  }

  toJSON () {
    return {
      status: this.status,
      success: this.success,
      message: this.message,
      ...(this.data ? { data: this.data } : {}),
      ...(this.errors ? { errors: this.errors } : {})
    }
  }
}

export default TError
