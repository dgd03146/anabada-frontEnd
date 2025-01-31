import React, { useState } from 'react';
import { useRouter } from 'next/router';
import usePost from '../../../quries/hooks/posts/usePost';
import useDeletePost from '../../../quries/hooks/posts/useDeletePost';
import useLike from '../../../quries/hooks/posts/useLike';
import Image from 'next/image';
import { FiEdit2, FiMoreHorizontal } from 'react-icons/fi';
import Navigate from '../../../components/layout/navigate';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AmentyInfo from '../../../components/amenties';

import Comments from '../../../components/comments';

import {
  AddressBox,
  Amenity,
  Box,
  ButtonContainer,
  HeartBtn,
  SelectContainer,
  ImageWrapper,
  TitleDiv,
  UserBox
} from './style';

import useUser from '../../../quries/hooks/user/useUser';

import LoadingSpinner from '../../../components/loading';
import PostViewer from '../../../pages/posts/add/viewer';

import useGetToken from '../../../lib/hooks/user/useGetToken';
import { BlurDataURL } from '../../../constants/contstant';

const PostContainer = () => {
  const accessToken = useGetToken();
  const router = useRouter();
  const postId = router.query.postId as string;

  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { post } = usePost(postId, liked);

  const { onDelete } = useDeletePost();
  const { onToggleLike } = useLike();
  const { user } = useUser();

  const nickname = user?.nickname;
  const profileImg = user?.profileImg;

  const getAmenity = post?.amenity?.split(' ');
  const isCurrentUser = nickname === post?.nickname;

  const onNavigateChat = (nickname: string) => {
    router.push(`/chat/${nickname}`);
  };

  const onShowModal = () => {
    setShowModal((prev) => !prev);
  };

  if (!post) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navigate text={'포스트'} />
      <TitleDiv>
        <span>{post.title}</span>
      </TitleDiv>
      <Box>
        <UserBox>
          <Image
            src={post.profileImg}
            alt="Profile Image"
            width={50}
            height={50}
            placeholder="blur"
            blurDataURL={BlurDataURL}
          />
          <span className="nickname">{post.nickname}</span>
          <span>{post.createdAt}</span>
          <span>{post.after}</span>
          <span>조회 {post.viewCount}</span>
        </UserBox>
        {accessToken && isCurrentUser && (
          <button className="moreBtn" onClick={onShowModal}>
            <FiMoreHorizontal />
          </button>
        )}
        {accessToken && nickname && !isCurrentUser && (
          <button
            className="chatBtn"
            onClick={() => {
              post.nickname && onNavigateChat(post.nickname);
            }}
          >
            <BsFillChatDotsFill />
          </button>
        )}
        {showModal && (
          <SelectContainer>
            <div
              className="editBtn"
              onClick={() => router.push(`/posts/${postId}/edit`)}
            >
              수정하기
              <FiEdit2 />
            </div>
            <div
              className="deleteBtn"
              onClick={() => {
                const result = window.confirm('정말 삭제하시겠습니까?');
                result && onDelete(postId);
              }}
            >
              삭제하기
              <RiDeleteBin5Line />
            </div>
          </SelectContainer>
        )}
      </Box>

      <ImageWrapper>
        {post.thumbnailUrl && (
          <Image
            src={post.thumbnailUrl}
            alt="Thumbnail"
            fill
            placeholder="blur"
            blurDataURL={BlurDataURL}
          />
        )}
      </ImageWrapper>
      <AddressBox>
        <Image
          src="/assets/icons/address.svg"
          alt="Address"
          width={16}
          height={16}
        />
        <span className="area">{post.area}</span>
        <span>{post.address}</span>
      </AddressBox>
      <Amenity>
        <label>주변정보</label>
        {getAmenity && <AmentyInfo amenities={getAmenity} />}
      </Amenity>
      <PostViewer content={post.content} />
      <ButtonContainer>
        {accessToken && nickname && !isCurrentUser && (
          <HeartBtn onClick={() => onToggleLike({ post, setLiked })}>
            <Image
              src={
                post.isLiked
                  ? '/assets/icons/heart-filled.svg'
                  : '/assets/icons/heart-unfilled.svg'
              }
              alt="Like svg"
              width={19}
              height={18}
            />
            <label htmlFor="heart">좋아요</label>
          </HeartBtn>
        )}
      </ButtonContainer>
      <Comments
        profileImg={profileImg}
        nickname={nickname}
        post={post}
        postId={postId}
      />
    </>
  );
};

export default PostContainer;
