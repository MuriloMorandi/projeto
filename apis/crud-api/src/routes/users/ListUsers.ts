import { asc, count } from "drizzle-orm";
import { usersTable } from "../../database/schema";
import { publicProcedure } from "../../trpc";

export default publicProcedure
    .query(async ({
        ctx: { db }
    }) => {
        const data = await db
            .select()
            .from(usersTable)
            .orderBy(asc(usersTable.name));
        
        const [dataCount] = await db.select({
                count: count()
            }).from(usersTable)
            .orderBy(asc(usersTable.name))
        
        return {
            data, count: dataCount.count     
        }

    })