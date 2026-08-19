import { useEffect, useState } from "react";
import "./UserRating.css";

interface UserRatingProps {
  rating: number | null;
  onSave: (rating: number) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function UserRating({ rating, onSave, onDelete }: UserRatingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(rating);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const handleOpen = () => {
    setSelectedRating(rating);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedRating(rating);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (selectedRating === null) return;

    try {
      setIsSaving(true);
      await onSave(selectedRating);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      setIsEditing(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isBusy = isSaving || isDeleting;

  if (!isEditing) {
    return (
      <button
        type="button"
        className={
          rating !== null
            ? "user-rating user-rating--rated"
            : "user-rating"
        }
        onClick={handleOpen}
      >
        {rating !== null ? `Ваша оценка: ${rating}/10` : "Оценить"}
      </button>
    );
  }

    return (
    <div className="user-rating-editor">
      <div className="user-rating-editor__header">
        <span className="user-rating-editor__label">
          Ваша оценка
        </span>

        {rating !== null && (
          <button
            type="button"
            className="user-rating-editor__delete"
            onClick={handleDelete}
            disabled={isBusy}
          >
            {isDeleting ? "Удаление…" : "Удалить"}
          </button>
        )}
      </div>

      <div className="user-rating-editor__values">
        {Array.from({ length: 10 }, (_, index) => {
          const value = index + 1;

          return (
            <button
              key={value}
              type="button"
              className={`user-rating-editor__value ${
                selectedRating === value
                  ? "user-rating-editor__value--selected"
                  : ""
              }`}
              onClick={() => setSelectedRating(value)}
              disabled={isBusy}
            >
              {value}
            </button>
          );
        })}
      </div>

      <div className="user-rating-editor__actions">
        <button
          type="button"
          className="user-rating-editor__save"
          disabled={selectedRating === null || isBusy}
          onClick={handleSave}
        >
          {isSaving ? "Сохранение…" : "Сохранить"}
        </button>

        <button
          type="button"
          className="user-rating-editor__cancel"
          disabled={isBusy}
          onClick={handleCancel}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}