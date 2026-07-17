import { ENDPOINTS } from "../core/endpoints.ts"
import type {
  JsonDecoder,
  PlatformRequestOptions,
  RequestExecutor,
} from "../core/request-executor.ts"
import type { PlatformRoute } from "../core/routing.ts"
import type { ContentDto, Locale } from "../types/content.ts"

export type ContentRequestOptions = PlatformRequestOptions & {
  readonly locale?: Locale
}

export type DecodedContentRequestOptions<T> = ContentRequestOptions & {
  readonly decode: JsonDecoder<T>
}

export class ContentApi {
  readonly #executor: RequestExecutor
  readonly #defaultPlatform: PlatformRoute

  constructor(executor: RequestExecutor, defaultPlatform: PlatformRoute) {
    this.#executor = executor
    this.#defaultPlatform = defaultPlatform
  }

  /** Returns VALORANT content, optionally localized with a Riot locale. */
  getContents(options?: ContentRequestOptions): Promise<ContentDto>
  getContents<T>(options: DecodedContentRequestOptions<T>): Promise<T>
  getContents<T>(
    options: ContentRequestOptions | DecodedContentRequestOptions<T> = {},
  ): Promise<ContentDto | T> {
    return this.#executor.request<ContentDto | T>({
      endpoint: ENDPOINTS.content.getContents,
      route: { kind: "platform", platform: options.platform ?? this.#defaultPlatform },
      path: "/val/content/v1/contents",
      query: { locale: options.locale },
      auth: { kind: "api-key" },
      options,
    })
  }
}
