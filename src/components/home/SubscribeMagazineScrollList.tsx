import React, { useEffect, useState } from "react";
import { getSubscribeMagazinePaperList, MagazineType } from "@/apis";
import SubscribeMagazinePreview from "./SubscribeMagazinePreview";
import styled from "styled-components";
import { useInfiniteScroll } from "@/utils";
import Loading from "#/lib/Loading";
import Empty from "#/lib/Empty";
import Button from "#/lib/Button";
import PopularMagazinesScrollList from "./PopularMagazinesScrollList";

const SubscribeContainer = styled.div`
  padding: 74px 0 50px 0;
`;

const StyledEmpty = styled(Empty)`
  padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;
  width: calc(100% - 28px);
  margin: 0 14px 14px 14px;
`;

const StyledButton = styled(Button)`
  font-weight: 300;
  padding: 10px 44px;
  background-color: ${(props) => props.theme.palette.common?.white};
  border: 1px solid ${(props) => props.theme.palette.text?.primary};
  color: ${(props) => props.theme.palette.text?.primary};
`;

const SubscribeMagazineScrollList: React.FC = () => {
  const [magazines, setMagazines] = useState<MagazineType[]>([]);
  const { loaderRef, hasMore, page, setHasMore, setLoading, firstLoading, setFirstLoading } =
    useInfiniteScroll<HTMLDivElement>({
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
        setMagazines((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
        setFirstLoading(false);
      }
    })();
  }, [page, setFirstLoading, setHasMore, setLoading]);

  return (
    <SubscribeContainer>
      {firstLoading ? null : (
        <>
          {magazines.length === 0 ? (
            <>
              <StyledEmpty
                title="New stories right to you"
                description="Subscribe to get latest stories from zines you love."
                type="magazine"
              >
                <StyledButton size={"medium"}>Explore more zines</StyledButton>
              </StyledEmpty>
              <PopularMagazinesScrollList />
            </>
          ) : null}
          {magazines.length > 0
            ? magazines?.map((magazine) => (
                <SubscribeMagazinePreview key={magazine.id} {...magazine} />
              ))
            : null}
          {hasMore ? <Loading ref={loaderRef} /> : null}
        </>
      )}
    </SubscribeContainer>
  );
};

export default SubscribeMagazineScrollList;
