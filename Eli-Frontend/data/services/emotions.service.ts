import { Emotion, EmotionCategory } from '@/data/models/emotions.model';
import emotionData from '@/data/json/emotions.json';

const emotions: Emotion[] = emotionData as Emotion[];

const emotionMap = new Map<string, Emotion>(
    emotions.map(emotion => [emotion.name, emotion])
);

export const defaultEmotion: Emotion = {
    name: 'Unknown',
    emoji: '🙂',
    category: EmotionCategory.Neutral,
    description: 'An emotion that is not yet categorized.'
};

/**
 * Retrieves all details for a specific emotion by its name.
 * If the emotion isn't found, it returns a safe default.
 *
 * @param name The name of the emotion (e.g., "Joy").
 * @returns The full Emotion object.
 */
export function getEmotionDetails(name: string): Emotion {
    const details = emotionMap.get(name);

    return details || { ...defaultEmotion, name };
}