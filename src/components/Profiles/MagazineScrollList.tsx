import React, { useEffect, useState } from "react";
import { getStarMagazines, getUserMagazines, MagazineType } from "@/apis";
import { useInfiniteScroll } from "@/utils";
import MagazinePreview from "./MagazinePreview";
import styled from "styled-components";
import Link from "next/link";

interface MagazineListType {
  userId: string;
  isStarContent?: boolean;
}
const PaperItem = styled.div`
  display: inline-block;
  width: 50%;
  height: auto;
  box-sizing: border-box;
  padding-left: 7px;
  margin-top: 2px;
`;
const MagazineScrollList: React.FC<MagazineListType> = (props) => {
  const [magazines, setMagazines] = useState<MagazineType[]>([]);
  const { loaderRef, page, setLoading, setHasMore, hasMore } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
    initialPage: 0,
  });
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = props.isStarContent
          ? await getStarMagazines({ userId: props.userId, page })
          : await getUserMagazines({ userId: props.userId, page });
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setMagazines((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, props.userId, setHasMore, setLoading, props.isStarContent]);
  return (
    <>
      {magazines.map((magazine) => (
        <Link key={magazine.id} href={`/magazine/${magazine.id}`}>
          <PaperItem>
            <MagazinePreview key={magazine.id} {...magazine} />
          </PaperItem>
        </Link>
      ))}
      {hasMore ? <div ref={loaderRef}>loading...</div> : null}
    </>
  );
};
export default MagazineScrollList;
