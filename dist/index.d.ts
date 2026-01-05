/**
 * @seriphxyz/solid - SolidJS primitives for Seriph widgets
 *
 * @example Subscribe form
 * ```tsx
 * import { createSubscribe } from '@seriphxyz/solid';
 *
 * function Newsletter() {
 *   const { subscribe, status, error } = createSubscribe({
 *     siteKey: 'your-site-key',
 *   });
 *
 *   const handleSubmit = (e: SubmitEvent) => {
 *     e.preventDefault();
 *     const email = new FormData(e.currentTarget as HTMLFormElement).get('email') as string;
 *     subscribe(email);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input type="email" name="email" required />
 *       <button disabled={status() === 'loading'}>
 *         {status() === 'loading' ? 'Subscribing...' : 'Subscribe'}
 *       </button>
 *       {status() === 'success' && <p>Thanks for subscribing!</p>}
 *       {status() === 'error' && <p>Error: {error()?.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 */
import { type Accessor } from "solid-js";
import { type SeriphConfig, type Comment, type Announcement, type PollWithResults, type FeedbackType, type ControllerStatus } from "@seriphxyz/core";
export type { SeriphConfig, SubscribeState, FormState, ReactionsState, CommentsState, WaitlistState, ViewCountsState, FeedbackState, PollState, AnnouncementsState, Comment, Announcement, PollWithResults, FeedbackType, ReactionCounts, SeriphPost, FetchPostsOptions, FetchPostOptions, ControllerStatus, } from "@seriphxyz/core";
export { fetchPosts, fetchPost, getConfigFromMeta, resolveConfig, DEFAULT_ENDPOINT, API_PATH, } from "@seriphxyz/core";
type OptionalSiteKey<T extends SeriphConfig> = Omit<T, "siteKey"> & {
    /** Site key - optional if <meta name="seriph-site-key"> is set */
    siteKey?: string;
};
export interface CreateSubscribeOptions extends OptionalSiteKey<SeriphConfig> {
}
export interface CreateSubscribeReturn {
    status: Accessor<ControllerStatus>;
    message: Accessor<string | null>;
    error: Accessor<Error | null>;
    subscribe: (email: string) => Promise<void>;
    reset: () => void;
}
/**
 * Primitive for handling email subscriptions.
 *
 * @example
 * ```tsx
 * // With explicit siteKey:
 * const { subscribe, status } = createSubscribe({ siteKey: 'your-key' });
 *
 * // Or with meta tag (add to document head):
 * // <meta name="seriph-site-key" content="your-key" />
 * const { subscribe, status } = createSubscribe({});
 * ```
 */
export declare function createSubscribe(options: CreateSubscribeOptions): CreateSubscribeReturn;
export interface CreateFormOptions extends OptionalSiteKey<SeriphConfig> {
    /** Form slug/identifier */
    formSlug: string;
}
export interface CreateFormReturn {
    status: Accessor<ControllerStatus>;
    message: Accessor<string | null>;
    error: Accessor<Error | null>;
    submit: (data: Record<string, unknown>) => Promise<void>;
    reset: () => void;
}
/**
 * Primitive for handling form submissions.
 *
 * @example
 * ```tsx
 * const { submit, status, error } = createForm({
 *   siteKey: 'your-site-key', // optional with meta tag
 *   formSlug: 'contact',
 * });
 *
 * const handleSubmit = (e: SubmitEvent) => {
 *   e.preventDefault();
 *   const formData = new FormData(e.currentTarget as HTMLFormElement);
 *   submit(Object.fromEntries(formData));
 * };
 * ```
 */
export declare function createForm(options: CreateFormOptions): CreateFormReturn;
export interface CreateReactionsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Content identifier (e.g., post slug) */
    contentId: string;
    /** Auto-fetch reactions on mount (default: true) */
    autoFetch?: boolean;
}
export interface CreateReactionsReturn {
    counts: Accessor<Record<string, number>>;
    userReactions: Accessor<string[]>;
    status: Accessor<ControllerStatus>;
    error: Accessor<Error | null>;
    addReaction: (type: string) => Promise<void>;
    removeReaction: (type: string) => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Primitive for handling reactions (likes, claps, etc.).
 *
 * @example
 * ```tsx
 * const { counts, userReactions, addReaction, removeReaction } = createReactions({
 *   contentId: 'my-post-slug',
 * });
 *
 * <button onClick={() => addReaction('like')}>
 *   Like ({counts().like || 0})
 * </button>
 * ```
 */
export declare function createReactions(options: CreateReactionsOptions): CreateReactionsReturn;
export interface CreateCommentsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Content identifier (e.g., post slug) */
    contentId: string;
    /** Auto-fetch comments on mount (default: true) */
    autoFetch?: boolean;
}
export interface CreateCommentsReturn {
    comments: Accessor<Comment[]>;
    status: Accessor<ControllerStatus>;
    error: Accessor<Error | null>;
    postComment: (author: string, content: string, options?: {
        authorEmail?: string;
        parentId?: string;
    }) => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Primitive for handling comments.
 *
 * @example
 * ```tsx
 * const { comments, status, postComment } = createComments({
 *   contentId: 'my-post-slug',
 * });
 *
 * <For each={comments()}>
 *   {(comment) => (
 *     <div>
 *       <strong>{comment.authorName}</strong>: {comment.content}
 *     </div>
 *   )}
 * </For>
 *
 * <button onClick={() => postComment('Anonymous', 'Great post!')}>
 *   Add Comment
 * </button>
 * ```
 */
export declare function createComments(options: CreateCommentsOptions): CreateCommentsReturn;
export interface CreateWaitlistOptions extends OptionalSiteKey<SeriphConfig> {
}
export interface CreateWaitlistReturn {
    status: Accessor<ControllerStatus>;
    message: Accessor<string | null>;
    position: Accessor<number | null>;
    error: Accessor<Error | null>;
    join: (email: string, options?: {
        name?: string;
        source?: string;
    }) => Promise<void>;
    reset: () => void;
}
/**
 * Primitive for handling waitlist signups.
 *
 * @example
 * ```tsx
 * const { join, status, position } = createWaitlist({});
 *
 * <button onClick={() => join('user@example.com')}>Join Waitlist</button>
 * {status() === 'success' && <p>You're #{position()} on the list!</p>}
 * ```
 */
export declare function createWaitlist(options: CreateWaitlistOptions): CreateWaitlistReturn;
export interface CreateViewsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Page identifier (e.g., slug or URL path) */
    pageId: string;
    /** Auto-record view on mount (default: true) */
    autoRecord?: boolean;
}
export interface CreateViewsReturn {
    views: Accessor<number>;
    uniqueVisitors: Accessor<number>;
    status: Accessor<ControllerStatus>;
    error: Accessor<Error | null>;
    record: () => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Primitive for tracking and displaying page views.
 *
 * @example
 * ```tsx
 * const { views, uniqueVisitors } = createViews({
 *   pageId: '/blog/my-post',
 * });
 *
 * <span>{views()} views ({uniqueVisitors()} unique)</span>
 * ```
 */
export declare function createViews(options: CreateViewsOptions): CreateViewsReturn;
export interface CreateFeedbackOptions extends OptionalSiteKey<SeriphConfig> {
}
export interface CreateFeedbackReturn {
    status: Accessor<ControllerStatus>;
    message: Accessor<string | null>;
    error: Accessor<Error | null>;
    submit: (type: FeedbackType, content: string, options?: {
        email?: string;
        pageUrl?: string;
    }) => Promise<void>;
    reset: () => void;
}
/**
 * Primitive for handling feedback submissions.
 *
 * @example
 * ```tsx
 * const { submit, status } = createFeedback({});
 *
 * <button onClick={() => submit('feature', 'Add dark mode!')}>
 *   Submit Feedback
 * </button>
 * ```
 */
export declare function createFeedback(options: CreateFeedbackOptions): CreateFeedbackReturn;
export interface CreatePollOptions extends OptionalSiteKey<SeriphConfig> {
    /** Poll slug */
    slug: string;
    /** Auto-fetch poll on mount (default: true) */
    autoFetch?: boolean;
}
export interface CreatePollReturn {
    poll: Accessor<PollWithResults | null>;
    status: Accessor<ControllerStatus>;
    error: Accessor<Error | null>;
    vote: (selectedOptions: string[]) => Promise<void>;
    hasVoted: Accessor<boolean>;
    refresh: () => Promise<void>;
}
/**
 * Primitive for displaying and voting on polls.
 *
 * @example
 * ```tsx
 * // With meta tag: <meta name="seriph-site-key" content="your-key" />
 * const { poll, vote, hasVoted } = createPoll({ slug: 'favorite-framework' });
 *
 * <Show when={poll()}>
 *   {(p) => (
 *     <div>
 *       <h3>{p().question}</h3>
 *       <For each={p().options}>
 *         {(opt) => (
 *           <button onClick={() => vote([opt.id])} disabled={hasVoted()}>
 *             {opt.text} ({p().results[opt.id] || 0} votes)
 *           </button>
 *         )}
 *       </For>
 *     </div>
 *   )}
 * </Show>
 * ```
 */
export declare function createPoll(options: CreatePollOptions): CreatePollReturn;
export interface CreateAnnouncementsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Auto-fetch announcements on mount (default: true) */
    autoFetch?: boolean;
}
export interface CreateAnnouncementsReturn {
    announcements: Accessor<Announcement[]>;
    status: Accessor<ControllerStatus>;
    error: Accessor<Error | null>;
    dismiss: (announcementId: number) => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Primitive for displaying site announcements.
 *
 * @example
 * ```tsx
 * // With meta tag: <meta name="seriph-site-key" content="your-key" />
 * const { announcements, dismiss } = createAnnouncements({});
 *
 * <For each={announcements()}>
 *   {(ann) => (
 *     <div class={`announcement-${ann.announcementType}`}>
 *       {ann.content}
 *       {ann.isDismissible && (
 *         <button onClick={() => dismiss(ann.id)}>Dismiss</button>
 *       )}
 *     </div>
 *   )}
 * </For>
 * ```
 */
export declare function createAnnouncements(options: CreateAnnouncementsOptions): CreateAnnouncementsReturn;
//# sourceMappingURL=index.d.ts.map