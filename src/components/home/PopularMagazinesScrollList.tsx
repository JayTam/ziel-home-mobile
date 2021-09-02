import React, { useEffect, useState } from "react";
import Tabs from "../../../lib/Tabs";
import TabPanel from "../../../lib/Tabs/TabPanel";
import styled from "styled-components";
import { getPopularMagazineList, MagazineType, subscribeMagazine } from "../../apis";
import { useInfiniteScroll, useLogin } from "../../utils";
import Loading from "../../../lib/Loading";
import PopularMagazinePreview from "./PopularMagazinePreview";
import produce from "immer";

const StyledTabs = styled(Tabs)`
  margin: 0 14px;
  font-size: 16px;
  line-height: 24px;
`;

const StyledTabPanel = styled(TabPanel)`
  padding: 0 14px;
`;

const PopularMagazinesScrollList: React.FC = () => {
  const [magazines, setMagazines] = useState<MagazineType[]>([]);
  const { withLogin } = useLogin();
  const { loaderRef, hasMore, page, setHasMore, setLoading } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
  });

  /**
   * 订阅杂志
   */
  const handleSubscribe = withLogin<MagazineType>(async (magazine) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setMagazines((prev) =>
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getPopularMagazineList({ page });
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setMagazines((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, setHasMore, setLoading]);

  return (
    <StyledTabs activeKey="0">
      <StyledTabPanel tab="Popular" indexKey="0">
        {magazines?.map((magazine) => (
          <PopularMagazinePreview
            key={magazine.id}
            {...magazine}
            onSubscribe={() => handleSubscribe(magazine)}
          />
        ))}
        {hasMore ? <Loading ref={loaderRef} /> : null}
      </StyledTabPanel>
    </StyledTabs>
  );
};

export default PopularMagazinesScrollList;
