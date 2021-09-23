import React, { useEffect, useState } from "react";
import { getSubscribeMagazinePaperList, MagazineType } from "@/apis";
import SubscribeMagazinePreview from "./SubscribeMagazinePreview";
import styled from "styled-components";
import { useInfiniteScroll } from "@/utils";
import Loading from "#/lib/Loading";
import Empty from "#/lib/Empty";
import Button from "#/lib/Button";
import PopularMagazinesScrollList from "./PopularMagazinesScrollList";
import FeedDialog from "@/components/feed/FeedDialog";
import { TFeedType } from "@/pages/feed";

const SubscribeContainer = styled.div`
  padding: 74px 0 50px 0;
`;

const StyledEmpty = styled(Empty)`
  position: relative;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
  width: calc(100% - 28px);
  margin: 0 14px 0 14px;
`;

const StyledButton = styled(Button)`
  font-weight: 300;
  padding: 10px 44px;
  background-color: ${(props) => props.theme.palette.common?.white};
  border: 1px solid ${(props) => props.theme.palette.text?.primary};
  color: ${(props) => props.theme.palette.text?.primary};
`;

interface SubscribeMagazineScrollListProps {
  onExploreMoreZines?: () => void;
}

const SubscribeMagazineScrollList: React.FC<SubscribeMagazineScrollListProps> = (props) => {
  const [magazines, setMagazines] = useState<MagazineType[]>([]);
  const [open, setOpen] = useState(false);
  const [paperId, setPaperId] = useState("");
  const [magazineId, setMagazineId] = useState("");
  const [feedType, setFeedType] = useState<TFeedType>("default");
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

  const handleOpenFeed = (type: TFeedType, magazineId: string, paperId?: string) => {
    setMagazineId(magazineId);
    if (paperId) setPaperId(paperId);
    setFeedType(type);
    setOpen(true);
  };

  const handleCloseFeed = () => {
    setOpen(false);
  };

  return (
    <>
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
                  <StyledButton size={"medium"} onClick={props.onExploreMoreZines}>
                    Explore more zines
                  </StyledButton>
                </StyledEmpty>
                <PopularMagazinesScrollList />
              </>
            ) : null}
            {magazines.length > 0 &&
              magazines?.map((magazine) => (
                <SubscribeMagazinePreview
                  key={magazine.id}
                  {...magazine}
                  onOpenFeed={handleOpenFeed}
                />
              ))}
            {hasMore ? <Loading ref={loaderRef} /> : null}
          </>
        )}
      </SubscribeContainer>
      <FeedDialog
        open={open}
        paperId={paperId}
        magazineId={magazineId}
        type={feedType}
        onClose={handleCloseFeed}
      />
    </>
  );
};

export default SubscribeMagazineScrollList;
