/**
 * @jamwidgets/solid - SolidJS primitives for Jamwidgets
 *
 * @example Subscribe form
 * ```tsx
 * import { createSubscribe } from '@jamwidgets/solid';
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
import { createSignal, createEffect, onCleanup } from "solid-js";
import { SubscribeController, FormController, ReactionsController, CommentsController, WaitlistController, ViewCountsController, FeedbackController, PollController, AnnouncementsController, resolveConfig, } from "@jamwidgets/core";
// Re-export API functions and helpers from core
export { fetchPosts, fetchPost, getConfigFromMeta, resolveConfig, DEFAULT_ENDPOINT, API_PATH, } from "@jamwidgets/core";
/**
 * Primitive for handling email subscriptions.
 *
 * @example
 * ```tsx
 * // With explicit siteKey:
 * const { subscribe, status } = createSubscribe({ siteKey: 'your-key' });
 *
 * // Or with meta tag (add to document head):
 * // <meta name="jamwidgets-site-key" content="your-key" />
 * const { subscribe, status } = createSubscribe({});
 * ```
 */
export function createSubscribe(options) {
    const [status, setStatus] = createSignal("idle");
    const [message, setMessage] = createSignal(null);
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new SubscribeController(config);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setStatus(state.status);
            setMessage(state.message);
            setError(state.error);
        });
        onCleanup(unsubscribe);
    });
    const subscribe = async (email) => {
        await controller.submit(email);
    };
    const reset = () => {
        controller.reset();
    };
    return { status, message, error, subscribe, reset };
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
export function createForm(options) {
    const [status, setStatus] = createSignal("idle");
    const [message, setMessage] = createSignal(null);
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new FormController(config, options.formSlug);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setStatus(state.status);
            setMessage(state.message);
            setError(state.error);
        });
        onCleanup(unsubscribe);
    });
    const submit = async (data) => {
        await controller.submit(data);
    };
    const reset = () => {
        controller.reset();
    };
    return { status, message, error, submit, reset };
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
export function createReactions(options) {
    const [counts, setCounts] = createSignal({});
    const [userReactions, setUserReactions] = createSignal([]);
    const [status, setStatus] = createSignal("idle");
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new ReactionsController(config, options.contentId);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setCounts(state.counts);
            setUserReactions(state.userReactions);
            setStatus(state.status);
            setError(state.error);
        });
        // Auto-fetch on mount (default: true)
        if (options.autoFetch !== false) {
            controller.fetch();
        }
        onCleanup(unsubscribe);
    });
    const addReaction = async (type) => {
        await controller.add(type);
    };
    const removeReaction = async (type) => {
        await controller.remove(type);
    };
    const refresh = async () => {
        await controller.fetch();
    };
    return { counts, userReactions, status, error, addReaction, removeReaction, refresh };
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
export function createComments(options) {
    const [comments, setComments] = createSignal([]);
    const [status, setStatus] = createSignal("idle");
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new CommentsController(config, options.contentId);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setComments(state.comments);
            setStatus(state.status);
            setError(state.error);
        });
        // Auto-fetch on mount (default: true)
        if (options.autoFetch !== false) {
            controller.fetch();
        }
        onCleanup(unsubscribe);
    });
    const postComment = async (author, content, options) => {
        await controller.post(author, content, options);
    };
    const refresh = async () => {
        await controller.fetch();
    };
    return { comments, status, error, postComment, refresh };
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
export function createWaitlist(options) {
    const [status, setStatus] = createSignal("idle");
    const [message, setMessage] = createSignal(null);
    const [position, setPosition] = createSignal(null);
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new WaitlistController(config);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setStatus(state.status);
            setMessage(state.message);
            setPosition(state.position);
            setError(state.error);
        });
        onCleanup(unsubscribe);
    });
    const join = async (email, opts) => {
        await controller.join(email, opts);
    };
    const reset = () => {
        controller.reset();
    };
    return { status, message, position, error, join, reset };
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
export function createViews(options) {
    const [views, setViews] = createSignal(0);
    const [uniqueVisitors, setUniqueVisitors] = createSignal(0);
    const [status, setStatus] = createSignal("idle");
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new ViewCountsController(config, options.pageId);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setViews(state.views);
            setUniqueVisitors(state.uniqueVisitors);
            setStatus(state.status);
            setError(state.error);
        });
        // Auto-record view on mount (default: true)
        if (options.autoRecord !== false) {
            controller.record();
        }
        onCleanup(unsubscribe);
    });
    const record = async () => {
        await controller.record();
    };
    const refresh = async () => {
        await controller.fetch();
    };
    return { views, uniqueVisitors, status, error, record, refresh };
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
export function createFeedback(options) {
    const [status, setStatus] = createSignal("idle");
    const [message, setMessage] = createSignal(null);
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new FeedbackController(config);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setStatus(state.status);
            setMessage(state.message);
            setError(state.error);
        });
        onCleanup(unsubscribe);
    });
    const submit = async (type, content, opts) => {
        await controller.submit(type, content, opts);
    };
    const reset = () => {
        controller.reset();
    };
    return { status, message, error, submit, reset };
}
/**
 * Primitive for displaying and voting on polls.
 *
 * @example
 * ```tsx
 * // With meta tag: <meta name="jamwidgets-site-key" content="your-key" />
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
export function createPoll(options) {
    const [poll, setPoll] = createSignal(null);
    const [status, setStatus] = createSignal("idle");
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new PollController(config, options.slug);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            setPoll(state.poll);
            setStatus(state.status);
            setError(state.error);
        });
        // Auto-fetch on mount (default: true)
        if (options.autoFetch !== false) {
            controller.fetch();
        }
        onCleanup(unsubscribe);
    });
    const vote = async (selectedOptions) => {
        await controller.vote(selectedOptions);
    };
    const refresh = async () => {
        await controller.fetch();
    };
    const hasVoted = () => controller.hasVoted();
    return { poll, status, error, vote, hasVoted, refresh };
}
/**
 * Primitive for displaying site announcements.
 *
 * @example
 * ```tsx
 * // With meta tag: <meta name="jamwidgets-site-key" content="your-key" />
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
export function createAnnouncements(options) {
    const [announcements, setAnnouncements] = createSignal([]);
    const [status, setStatus] = createSignal("idle");
    const [error, setError] = createSignal(null);
    const config = resolveConfig(options);
    const controller = new AnnouncementsController(config);
    createEffect(() => {
        const unsubscribe = controller.subscribe((state) => {
            // Only show non-dismissed announcements
            setAnnouncements(controller.getVisibleAnnouncements());
            setStatus(state.status);
            setError(state.error);
        });
        // Auto-fetch on mount (default: true)
        if (options.autoFetch !== false) {
            controller.fetch();
        }
        onCleanup(unsubscribe);
    });
    const dismiss = async (announcementId) => {
        await controller.dismiss(announcementId);
    };
    const refresh = async () => {
        await controller.fetch();
    };
    return { announcements, status, error, dismiss, refresh };
}
