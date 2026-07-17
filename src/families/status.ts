import { ENDPOINTS } from "../core/endpoints.ts"
import type {
  PlatformDecodedRequestOptions,
  PlatformRequestOptions,
  RequestExecutor,
} from "../core/request-executor.ts"
import type { PlatformRoute } from "../core/routing.ts"
import type { PlatformDataDto } from "../types/status.ts"

export class StatusApi {
  readonly #executor: RequestExecutor
  readonly #defaultPlatform: PlatformRoute

  constructor(executor: RequestExecutor, defaultPlatform: PlatformRoute) {
    this.#executor = executor
    this.#defaultPlatform = defaultPlatform
  }

  /** Returns current platform incidents and maintenances. */
  getPlatformData(options?: PlatformRequestOptions): Promise<PlatformDataDto>
  getPlatformData<T>(options: PlatformDecodedRequestOptions<T>): Promise<T>
  getPlatformData<T>(
    options: PlatformRequestOptions | PlatformDecodedRequestOptions<T> = {},
  ): Promise<PlatformDataDto | T> {
    return this.#executor.request<PlatformDataDto | T>({
      endpoint: ENDPOINTS.status.getPlatformData,
      route: { kind: "platform", platform: options.platform ?? this.#defaultPlatform },
      path: "/val/status/v1/platform-data",
      auth: { kind: "api-key" },
      options,
    })
  }
}
