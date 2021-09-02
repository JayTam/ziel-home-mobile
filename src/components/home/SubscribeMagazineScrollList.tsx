import React, { useEffect, useState } from "react";
import { getSubscribeMagazinePaperList, MagazineType } from "../../apis";
import SubscribeMagazinePreview from "./SubscribeMagazinePreview";
import styled from "styled-components";
import { useInfiniteScroll } from "../../utils";
import Loading from "../../../lib/Loading";

const SubscribeContainer = styled.div`
  padding: 74px 0 50px 0;
`;

const SubscribeMagazineScrollList: React.FC = () => {
  const [subscribedMagazines, setSubscribedMagazines] = useState<MagazineType[]>([]);
  const { loaderRef, hasMore, page, setHasMore, setLoading } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getSubscribeMagazinePaperList({ page });
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setSubscribedMagazines((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, setHasMore, setLoading]);

  return (
    <SubscribeContainer>
      {subscribedMagazines?.map((magazine) => (
        <SubscribeMagazinePreview key={magazine.id} {...magazine} />
      ))}
      {hasMore ? <Loading ref={loaderRef} /> : null}
    </SubscribeContainer>
  );
};

export default SubscribeMagazineScrollList;
