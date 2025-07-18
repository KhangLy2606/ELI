/**
 * Defines the categories for emotions, used for styling.
 */
export enum EmotionCategory {
    Positive = 'Positive',
    Negative = 'Negative',
    Neutral = 'Neutral',
}

/**
 * Represents a single emotion with all its associated properties.
 */
export interface Emotion {
    name: string;
    emoji: string;
    category: EmotionCategory;
    description: string;
}

/**
 * A centralized map of emotion categories to their corresponding UI styles.
 */
export const emotionColorStyles: Record<EmotionCategory, string> = {
    [EmotionCategory.Positive]: 'bg-gradient-to-br from-yellow-300 to-pink-400',
    [EmotionCategory.Negative]: 'bg-gradient-to-br from-blue-300 to-purple-400',
    [EmotionCategory.Neutral]: 'bg-gradient-to-br from-green-300 to-teal-300',
};