import { useEffect, useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { CommentApi, type Comment } from "@/api/comment";
import "./CommentSection.css";
import { Link } from "react-router-dom";

export const CommentSection = observer(function CommentSection({ movieId }: { movieId: number }) {
    const { auth } = useStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        CommentApi.getForMovie(movieId)
            .then(setComments)
            .finally(() => setIsLoading(false));
    }, [movieId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            const created = await CommentApi.create(movieId, text.trim());
            setComments((prev) => [created, ...prev]);
            setText("");
        } finally {
            setIsSubmitting(false);
        }
    }
    const handleLike = async (comment: Comment) => {
        if (!auth.isAuthenticated) return;

        // 1. Сразу меняем UI, не дожидаясь ответа сервера
        setComments((prev) =>
            prev.map((c) =>
                c.id === comment.id
                    ? {
                        ...c,
                        isLikedByCurrentUser: !c.isLikedByCurrentUser,
                        likesCount: c.likesCount + (c.isLikedByCurrentUser ? -1 : 1),
                    }
                    : c
            )
        );

        // 2. Отправляем запрос по-настоящему
        try {
            await CommentApi.toggleLike(movieId, comment.id);
        } catch {
            // 3. Если сервер отказал — откатываем к состоянию ДО клика
            setComments((prev) => prev.map((c) => (c.id === comment.id ? comment : c)));
        }
    };

    const handleDelete = async (commentId: number) => {
        const prevComments = comments;
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        try {
            await CommentApi.remove(movieId, commentId);
        } catch {
            setComments(prevComments); // не удалилось на сервере — вернуть как было
        }
    };

    return (
        <section className="comments">
            <h2 className="comments__title">Отзывы ({comments.length})</h2>

            {auth.isAuthenticated ? (
                <form className="comments__form" onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Поделитесь впечатлением о фильме…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                    />
                    <button type="submit" disabled={isSubmitting || !text.trim()}>
                        {isSubmitting ? "Отправка…" : "Опубликовать"}
                    </button>
                </form>
            ) : (
                <p className="comments__login-hint">
                    Чтобы оставить отзыв, нужно{" "}
                    <Link className="comments__login-hint-link" to="/login">войти</Link>
                    {" "}в аккаунт.
                </p>
            )}

            {isLoading ? (
                <p className="comments__empty">Загружаем отзывы…</p>
            ) : comments.length === 0 ? (
                <p className="comments__empty">Отзывов пока нет — станьте первым.</p>
            ) : (
                <ul className="comments__list">
                    {comments.map((comment) => (
                        <li key={comment.id} className="comment">
                            <div className="comment__avatar">
                                {comment.owner.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="comment__body">
                                <div className="comment__head">
                                    <span className="comment__author">{comment.owner.name}</span>
                                    <span className="comment__date">
                                        {new Date(comment.creationDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="comment__text">{comment.content}</p>
                                <div className="comment__actions">
                                    <button
                                        className={`comment__like ${comment.isLikedByCurrentUser ? "comment__like--active" : ""}`}
                                        onClick={() => handleLike(comment)}
                                        disabled={!auth.isAuthenticated}
                                    >
                                        ♥ {comment.likesCount}
                                    </button>
                                    {auth.user?.id === comment.owner.id && (
                                        <button className="comment__delete" onClick={() => handleDelete(comment.id)}>
                                            Удалить
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
});
