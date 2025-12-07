// supabase/functions/weather-poller/__tests__/index.test.ts
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { mock } from "https://deno.land/x/mock/mod.ts";
import { handleRequest } from "../index.ts"; // Assuming you refactor the logic into a handler

// Mock Supabase client
const mockSupabaseClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => ({
            data: null,
            error: null,
          }),
        }),
      }),
    }),
    insert: () => ({
      error: null,
    }),
  }),
};

// Mock fetch
const mockFetch = (response: any, ok: boolean) => {
  return (
    _input: string | Request | URL,
    _init?: RequestInit | undefined
  ) => {
    return Promise.resolve(new Response(JSON.stringify(response), {
      status: ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    }));
  };
};

Deno.test("Weather poller returns cached data", async () => {
  const mockedClient = {
    ...mockSupabaseClient,
    from: () => ({
      ...mockSupabaseClient.from(),
      select: () => ({
        ...mockSupabaseClient.from().select(),
        eq: () => ({
          ...mockSupabaseClient.from().select().eq(),
          order: () => ({
            ...mockSupabaseClient.from().select().eq().order(),
            limit: () => ({
              data: [{ data: { temp: 10 }, created_at: new Date().toISOString() }],
              error: null,
            }),
          }),
        }),
      }),
    }),
  };

  const req = new Request("http://localhost");
  const res = await handleRequest(req, mockedClient);
  const data = await res.json();

  assertEquals(data.temp, 10);
});

Deno.test("Weather poller fetches new data", async () => {
  globalThis.fetch = mockFetch({ temp: 20 }, true);

  const req = new Request("http://localhost");
  const res = await handleRequest(req, mockSupabaseClient);
  const data = await res.json();

  assertEquals(data.temp, 20);
});
