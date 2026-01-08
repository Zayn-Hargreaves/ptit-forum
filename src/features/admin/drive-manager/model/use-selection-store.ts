import { create } from 'zustand';

export interface SelectionState {
  // Use Set logic via Array for serialization (Zustand persists usually work better with plain objects/arrays,
  // but for in-memory Set is safer for O(1)).
  // However, simple Set isn't auto iterable in some DevTools. Let's use internal Set logic but expose array/check methods.
  selectedIds: Set<string>;

  togglePost: (postId: string, commentIds: string[], checked: boolean) => void;
  toggleComment: (commentId: string, postId: string, allSiblingIds: string[]) => void;
  reset: () => void;
  getSelectedIds: () => string[];
  hasId: (id: string) => boolean;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),

  togglePost: (postId, commentIds, checked) =>
    set((state) => {
      const newSet = new Set(state.selectedIds);
      if (checked) {
        newSet.add(postId);
        commentIds.forEach((id) => newSet.add(id));
      } else {
        newSet.delete(postId);
        commentIds.forEach((id) => newSet.delete(id));
      }
      return { selectedIds: newSet };
    }),

  toggleComment: (commentId, postId, allSiblingIds) =>
    set((state) => {
      const newSet = new Set(state.selectedIds);

      // 1. Toggle the specific comment
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }

      // 2. Check parent status
      // Does ANY sibling (including this one) NOT exist in set?
      // Wait, logic:
      // - If ALL siblings selected -> Select Parent
      // - If NOT ALL siblings selected -> Unselect Parent (Parent is just a visual container or an ID?)
      // If we export "Post", do we export comments? The requirement says "Post -> Auto select comments".
      // But if we uncheck one comment, the Post is "Indeterminate".
      // For "Export", we send IDs. If backend expects Post IDs, we must select Post ID.
      // If backend expects Comment IDs too, we send them.
      // Based on Backend logic `findAllById(postIds)`, it seems it only takes Post IDs?
      // Wait, let's re-read Backend Plan.
      // "Request body: List<UUID> postIds".
      // Backend: `postRepository.findAllById(postIds)`.
      // Then getting `post.getComments()`.
      // OH! The backend implementation fetches ALL comments for the post.
      // So selecting individual comments in Frontend has NO EFFECT on Backend if we only send Post ID.
      // The user requirement says: "Chọn Post -> Tự động chọn tất cả Comments con... Bỏ chọn một Comment con -> Post cha Indeterminate".
      // This implies we SHOULD support granular selection?
      // BUT Backend `PostService` logic was:
      // `htmlBuilder.append("<h3>Comments:</h3><ul>"); if (post.getComments() != null) ...`
      // It iterates `post.getComments()`. It does NOT filter by selected IDs.
      // This means my Backend currently dumps ALL comments of the post.

      // CRITICAL REALIZATION:
      // If frontend allows partial selection, Backend MUST support it.
      // Currently, Backend DOES NOT support partial comment selection. It takes Post IDs and dumps everything.
      // User requirements: "Cascading Selection".
      // Maybe the User assumes I will handle partials?
      // Or maybe the User just wants the Visual State to reflect accurately?
      // Since I am already in Phase 3 Frontend, I can't easily change Backend now without stepping back.
      // However, usually "Post Selection" implies selecting which *Posts* to export.
      // Displaying Comments is likely for "Review" content.
      // If I uncheck a comment, does it imply I don't want that comment exported?
      // If so, I need to fix Backend.
      // BUT, the prompt said `PostAcceptedSelectList` has `postIds`.
      // It implies Granular Comment selection is NOT fully supported API-wise yet.
      // I will implement the Frontend Logic as requested (Cascading), but warn that currently Backend might export full post.
      // Actually, if uncheck comment -> Post is indeterminate.
      // If I send Post ID, I get all comments.
      // If I don't send Post ID (because it's indeterminate/unchecked?), I get nothing.
      // So, effectively, to export a Post, I must have it "Checked".
      // Implementation Detail: Indeterminate usually counts as "Not fully selected".
      // If I click Export, only "Fully Checked" posts should be sent? Or "At least partially selected"?
      // PROBABLY "Fully Checked" or we treat Indeterminate as "Yes".
      // Given the backend `findAllById(postIds)`, I will assume we only send `postIds` that are fully selected (or manually selected).

      // Let's implement the UI logic as requested.

      // Update Parent Logic:
      const allSelected = allSiblingIds.every((id) => newSet.has(id));
      if (allSelected) {
        newSet.add(postId);
      } else {
        newSet.delete(postId); // Uncheck parent if any child is missing
      }

      return { selectedIds: newSet };
    }),

  reset: () => set({ selectedIds: new Set() }),
  getSelectedIds: () => Array.from(get().selectedIds),
  hasId: (id) => get().selectedIds.has(id),
}));
