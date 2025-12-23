'use server';

import fs from 'fs/promises';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'lib', 'config.json');

export interface AppConfig {
    adDuration: number;
}

export async function getAdConfiguration(): Promise<AppConfig> {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read config file:', error);
        return { adDuration: 10 }; // Default fallback
    }
}

export async function updateAdDuration(duration: number): Promise<void> {
    try {
        const currentConfig = await getAdConfiguration();
        const newConfig = { ...currentConfig, adDuration: duration };
        await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
    } catch (error) {
        console.error('Failed to write config file:', error);
        throw new Error('Failed to update configuration');
    }
}
