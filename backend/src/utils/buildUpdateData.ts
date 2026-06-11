import type { Response } from "express";

export default function buildUpdateData(
    fields: Record<string, unknown>,
    res: Response,
): Record<string, unknown> | null {
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== null) {
            updateData[key] = value;
        }
    }

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: "Nothing to update" });
        return null;
    }

    return updateData;
}
