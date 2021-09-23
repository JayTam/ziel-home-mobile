import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMagazineList, MagazineType, subscribeMagazine } from "@/apis";
import MagazineCard from "./MagazineCard";
import produce from "immer";
import { useInfiniteScroll, useLogin } from "@/utils";
import Loading from "#/lib/Loading";
import FeedDialog from "@/components/feed/FeedDialog";

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
  const { withLogin } = useLogin();
  const [exploreMagazines, setExploreMagazines] = useState<MagazineType[]>([]);
  const [currentMagazine, setCurrentMagazine] = useState<MagazineType | null>(null);
  const [open, setOpen] = useState(false);
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

  /**
   * 打开Feed流弹窗
   * @param magazine
   */
  const handleOpenFeed = (magazine: MagazineType) => {
    setOpen(true);
    setCurrentMagazine(magazine);
  };

  /**
   * 关闭Feed流弹窗
   */
  const handleCLoseFeed = (magazine: MagazineType) => {
    setExploreMagazines((prev) =>
      prev.map((item) => {
        if (item.id === magazine.id) {
          return {
            ...item,
            isSubscribe: magazine.isSubscribe,
            subscribeNum: magazine.subscribeNum,
          };
        }
        return item;
      })
    );
    setCurrentMagazine(null);
    setOpen(false);
  };

  return (
    <ExploreContainer>
      <FeedDialog open={open} magazineId={currentMagazine?.id} onClose={handleCLoseFeed} />
      {exploreMagazines.map((magazine) => (
        <MagazineCard
          key={magazine.id}
          {...magazine}
          onSubscribe={() => handleSubscribe(magazine)}
          onOpenFeed={() => handleOpenFeed(magazine)}
        />
      ))}
      {hasMore ? <StyledLoading ref={loaderRef} /> : null}
    </ExploreContainer>
  );
};

export default ExploreMagazineScrollList;
