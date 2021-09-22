import React, { useEffect, useState } from "react";
import { getStarMagazines, getUserMagazines, MagazineType } from "@/apis";
import { useInfiniteScroll } from "@/utils";
import MagazinePreview from "./MagazinePreview";
import styled from "styled-components";
import Link from "next/link";
import Empty from "#/lib/Empty";

interface MagazineListType {
  userId: string;
  isStarContent?: boolean;
}
const PaperItem = styled.div`
  display: inline-block;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0px 17px 40px 24px;
`;
const MagazineScrollList: React.FC<MagazineListType> = (props) => {
  const [magazines, setMagazines] = useState<MagazineType[]>([]);
  const { loaderRef, page, setLoading, setHasMore, hasMore, firstLoading, setFirstLoading } =
    useInfiniteScroll<HTMLDivElement>({
      hasMore: false,
      initialPage: 1,
    });
  useEffect(() => {
    (async () => {
      if (page === 1) {
        setFirstLoading(true);
      }
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
        setFirstLoading(false);
      }
    })();
  }, [page, props.userId, setHasMore, setLoading, props.isStarContent, setFirstLoading]);
  return (
    <>
      {magazines.length === 0 && !firstLoading ? (
        <Empty type="magazine" />
      ) : (
        magazines.map((magazine) => (
          <Link key={magazine.id} href={`/magazine/${magazine.id}`}>
            <PaperItem>
              <MagazinePreview key={magazine.id} {...magazine} />
            </PaperItem>
          </Link>
        ))
      )}
      {hasMore ? <div ref={loaderRef}>loading...</div> : null}
    </>
  );
};
export default MagazineScrollList;
