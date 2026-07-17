import { RequestCancelledError, RequestTimeoutError, TransportError } from "./errors.ts"

export type OperationSignals = {
  readonly callerSignal: AbortSignal | undefined
  readonly timeoutSignal: AbortSignal
  readonly signal: AbortSignal
  readonly timeoutMs: number
}

export function createOperationSignals(
  callerSignal: AbortSignal | undefined,
  timeoutMs: number,
): OperationSignals {
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const signal =
    callerSignal === undefined ? timeoutSignal : AbortSignal.any([callerSignal, timeoutSignal])
  return { callerSignal, timeoutSignal, signal, timeoutMs }
}

export function waitForOperation<T>(promise: Promise<T>, operation: OperationSignals): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(createOperationAbortError(operation))
    operation.signal.addEventListener("abort", onAbort, { once: true })
    promise.then(resolve, reject).finally(() => {
      operation.signal.removeEventListener("abort", onAbort)
    })
    if (operation.signal.aborted) {
      onAbort()
    }
  })
}

export function normalizeOperationError(error: unknown, operation: OperationSignals): Error {
  if (error instanceof RequestCancelledError || error instanceof RequestTimeoutError) {
    return error
  }
  if (operation.signal.aborted) {
    return createOperationAbortError(operation, error)
  }
  if (error instanceof Error) {
    return error
  }
  return new TransportError({ cause: error })
}

function createOperationAbortError(operation: OperationSignals, cause?: unknown): Error {
  if (operation.callerSignal?.aborted === true) {
    return new RequestCancelledError(operation.callerSignal.reason, { cause })
  }
  return new RequestTimeoutError(operation.timeoutMs, { cause })
}
