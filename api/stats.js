import { kv } from '@vercel/kv';

export const config = {
    runtime: 'edge',
};

const STATS_KEY = 'stats:global';
const BASE_COUNT = 2849; // 基础数量，从上线时开始

export default async function handler(req) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        // GET: 获取统计数据
        if (req.method === 'GET') {
            const count = await kv.get(STATS_KEY) || 0;
            const total = BASE_COUNT + parseInt(count);

            return new Response(JSON.stringify({
                imagesFixed: total,
                successRate: 98,
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        // POST: 增加统计数量
        if (req.method === 'POST') {
            const { count = 1 } = await req.json().catch(() => ({}));
            const newCount = await kv.incrby(STATS_KEY, parseInt(count) || 1);
            const total = BASE_COUNT + parseInt(newCount);

            return new Response(JSON.stringify({
                imagesFixed: total,
                added: parseInt(count) || 1
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });

    } catch (error) {
        console.error("Stats API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}
