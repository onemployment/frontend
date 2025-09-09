import { attachAuthHeader } from '../features/auth/tokenHeader';

export type GetState<State> = () => State;

export function createPrepareHeaders<State>(
  selectToken: (state: State) => string | null | undefined
) {
  return (headers: Headers, api: { getState: GetState<State> }): Headers => {
    try {
      const state = api.getState();
      const token = selectToken(state) ?? null;
      attachAuthHeader(headers, token);
    } catch {
      // no-op: never break requests due to header prep
    }
    return headers;
  };
}
