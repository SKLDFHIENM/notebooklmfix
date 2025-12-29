import { GoogleGenAI } from "@google/genai";
import { kv } from '@vercel/kv';

export const config = {
    // runtime: 'edge', // Disable Edge to allow larger body size and longer timeout
    maxDuration: 60,
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        // Node.js runtime automatically parses JSON body into req.body
        const { image, accessCode, imageSize, aspectRatio } = req.body;

        // --- PROMPT SECURITY: DEFINE ON SERVER SIDE ---
        // Do not trust client-sent prompts. Use server-controlled prompts.
        const SYSTEM_PROMPT = "你是一个专业的图像修复专家。";
        const USER_PROMPT = "请将这张图片用最高的分辨率生成；2. 修复图片中的中文文字错误，修复的过程中，如遇原文字特别不清晰的，或错误特别严重的，需要结合语境做解读，猜测它具体是什么文字。（但不可把一个文字改成另外一个毫不相干的文字）。3. 请保持原图的构图、布局、文字内容完全一致，仅提升画质、清晰度以及修复文字错误。";

        // 1. Validate Access Code & Quota via Vercel KV (Hash)
        const key = `ac:${accessCode}`;
        const quotaData = await kv.hgetall(key);

        if (!quotaData) {
            return res.status(401).json({ error: "无效的激活码 (Invalid Access Code)" });
        }

        const remaining = parseInt(quotaData.remaining);
        if (remaining <= 0) {
            return res.status(403).json({
                error: "配额已用尽 (Quota Exceeded)",
                quota: { ...quotaData, remaining }
            });
        }

        // 2. Validate API Key (Server-side)
        const SERVER_KEY = process.env.GEMINI_API_KEY;
        if (!SERVER_KEY) {
            return res.status(500).json({ error: "Server Error: GEMINI_API_KEY Config Missing" });
        }

        // 3. Call Google Gemini
        const ai = new GoogleGenAI({ apiKey: SERVER_KEY });
        const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [
                    { text: USER_PROMPT }, // Use server-side prompt
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: cleanBase64,
                        },
                    },
                ],
            },
            config: {
                systemInstruction: SYSTEM_PROMPT, // Also apply system prompt

                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio || "1:1",
                        imageSize: imageSize || "4K", // Force 4K if using Access Code
                    }
                }
            });

        // 4. Deduct Quota (Atomic HINCRBY)
        const newRemaining = await kv.hincrby(key, 'remaining', -1);

        const newQuota = {
            total: parseInt(quotaData.total),
            remaining: Math.max(0, newRemaining)
        };

        // 5. Return result with new quota info
        const candidates = response.candidates;
        if (!candidates || !candidates[0] || !candidates[0].content) {
            // Restore quota if generation failed
            await kv.hincrby(key, 'remaining', 1);
            throw new Error("No candidates returned");
        }

        return res.status(200).json({
            candidates,
            quota: newQuota
        });

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
