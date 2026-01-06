export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export interface ReactionRequest {
  targetId: string;
  targetType: 'POST' | 'COMMENT';
  reactionType: ReactionType;
}
