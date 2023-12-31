import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentType } from "types/commentItem";
import useYoutubeApiStore from "stores/useYoutubeApiStore";
import getElapsedTime from "utils/getElapsedTime";
import decodeHTMLEntities from "utils/setDecodeHTMLEntities";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "styles/detail/Comment.module.css";

interface CommmetPropsType {
  item: CommentType;
  activeCommentId: number | null;
  setActiveCommentId: React.Dispatch<React.SetStateAction<number | null>>;
  videoId: string;
}

const Comment: React.FC<CommmetPropsType> = ({
  item,
  activeCommentId,
  setActiveCommentId,
  videoId,
}) => {
  const { youtube } = useYoutubeApiStore();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id: number) => youtube!.deleteComment(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["commentData", videoId] }),
  });

  const handleClickDeleteBtn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    mutate(item.id);
  };

  return (
    <div className={styles["comment"]}>
      <div className={styles["comment__container"]}>
        <strong className={styles["comment__user"]}>
          @user-{item.anonymous_user_id.split("-").at(-1)}
        </strong>
        <span className={styles["comment__created-at"]}>
          {getElapsedTime(item.created_at)}
        </span>
        <p className={styles["comment__text"]}>
          {decodeHTMLEntities(item.text as string)}
        </p>
      </div>

      <button
        type="button"
        className={`${styles["comment__ellipsis"]} ${
          item.id === activeCommentId && styles["active"]
        }`}
        onClick={() => setActiveCommentId(item.id)}
        onBlur={() => setActiveCommentId(null)}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>

      {item.id === activeCommentId && (
        <>
          <div className={styles["comment__button-list"]}>
            <button type="button" onMouseDown={handleClickDeleteBtn}>
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
