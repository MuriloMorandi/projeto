import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouterType } from '@projeto/crud-api';

export const useAPi = () => {
    const client = createTRPCClient<AppRouterType>({
        links: [
            httpBatchLink({
                url:`${process.env.URL_API}`,
            })
        ]
    });

    return client;
}