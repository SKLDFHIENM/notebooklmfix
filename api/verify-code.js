import { kv } from '@vercel/kv';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { accessCode } = await req.json();

        if (!accessCode) {
            return new Response(JSON.stringify({ error: "Access Code is required" }), { status: 400 });
        }

        const key = `ac:${accessCode}`;
        const data = await kv.hgetall(key);

        if (!data) {
            return new Response(JSON.stringify({ valid: false, error: "Invalid Access Code" }), { status: 200 });
        }

        // Check for migration (Times -> Credits)
        let isMigrated = false;
        let migratedFrom = null;

        if (data.credits === undefined) {
            // Old schema: migrate to credits (x2)
            const oldRemaining = parseInt(data.remaining || 0);
            const oldTotal = parseInt(data.total || 0);

            const newCredits = oldRemaining * 2;
            const newTotalCredits = oldTotal * 2;

            // Update KV with new schema
            await kv.hset(key, {
                credits: newCredits,
                totalCredits: newTotalCredits,
                remaining: newCredits, // Keep legacy field synced for safety
                total: newTotalCredits, // Keep legacy field synced for safety
                migrated: 'true'
            });

            // Update local data variable to reflect new state
            data.credits = newCredits;
            data.totalCredits = newTotalCredits;

            isMigrated = true;
            migratedFrom = oldRemaining;
        }

        const quotaInfo = {
            total: parseInt(data.totalCredits || data.total),
            remaining: parseInt(data.credits || data.remaining),
            valid: data.valid,
            migratedFrom: isMigrated ? migratedFrom : undefined
        };

        if (quotaInfo.remaining <= 0) {
            return new Response(JSON.stringify({
                valid: false,
                error: "Quota Exceeded",
                quota: quotaInfo
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            valid: true,
            quota: quotaInfo
        }), { status: 200 });

    } catch (error) {
        console.error("Verify Code Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
