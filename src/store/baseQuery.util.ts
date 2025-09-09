import { createPrepareHeaders } from './prepareHeaders';

export interface AuthedBaseQueryOptions<State> {
  baseUrl: string;
  selectToken: (state: State) => string | null | undefined;
}

export function createAuthedBaseQuery<State>(
  options: AuthedBaseQueryOptions<State>
) {
  const prepareHeaders = createPrepareHeaders<State>(options.selectToken);

  // The returned shape mirrors only what our unit tests require for now
  return {
    prepareHeaders,
  } as const;
}
