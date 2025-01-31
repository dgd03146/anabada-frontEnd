import { commentsApi } from '../../../services/api';
import { TComments, TResponse } from '../../../lib/types/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKeys } from '../../key';

type TGetComments<T> = (pageParam: number, postId: string) => T | Promise<T>;

const getComments: TGetComments<TResponse<TComments>> = async (
  pageParam,
  postId
) => {
  try {
    const res = await commentsApi.getComments(pageParam, postId);
    const { content: data, last } = res.data;
    return { data, nextPage: pageParam + 1, last };
  } catch (err) {
    throw new Error('Failed to fetch comments');
  }
};

const useComments = (postId: string) => {
  const {
    data: comments,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error
  } = useInfiniteQuery(
    [QueryKeys.commentList],
    ({ pageParam = 0 }) => {
      try {
        return getComments(pageParam, postId);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch comments');
      }
    },
    {
      getNextPageParam: (lastPage) =>
        !lastPage.last ? lastPage.nextPage : undefined
    }
  );

  if (isError) {
    console.error(error);
    // TODO: 에러바운더리 써서 try catch 없애기
    // Handle error UI
  }

  return { comments, fetchNextPage, isFetchingNextPage };
};

export default useComments;
