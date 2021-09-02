import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMagazineList, MagazineType, subscribeMagazine } from "../../apis";
import MagazineCard from "./MagazineCard";
import produce from "immer";
import { useInfiniteScroll, useLogin } from "../../utils";
import { useRouter } from "next/router";
import Loading from "../../../lib/Loading";

const ExploreContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 74px 0 50px 0;
`;

const StyledLoading = styled(Loading)`
  margin-bottom: 20px;
`;

const ExploreMagazineScrollList: React.FC = () => {
  const router = useRouter();
  const { withLogin } = useLogin();
  const [exploreMagazines, setExploreMagazines] = useState<MagazineType[]>([]);
  const { loaderRef, hasMore, page, setHasMore, setLoading } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getMagazineList({ page });
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setExploreMagazines((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, setHasMore, setLoading]);

  /**
   * 订阅杂志
   */
  const handleSubscribe = withLogin<MagazineType>(async (magazine) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setExploreMagazines((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === magazine.id) {
            item.isSubscribe = isSubscribe;
            if (isSubscribe) {
              item.subscribeNum = magazine.subscribeNum + 1;
            } else {
              item.subscribeNum = magazine.subscribeNum - 1;
            }
          }
        });
        return draft;
      })
    );
  });

  return (
    <ExploreContainer>
      {exploreMagazines.map((magazine) => (
        <MagazineCard
          key={magazine.id}
          {...magazine}
          onSubscribe={() => handleSubscribe(magazine)}
          onClick={() => router.push(`/feed?magazine_id=${magazine.id}`)}
        />
      ))}
      {hasMore ? <StyledLoading ref={loaderRef} /> : null}
    </ExploreContainer>
  );
};

export default ExploreMagazineScrollList;
