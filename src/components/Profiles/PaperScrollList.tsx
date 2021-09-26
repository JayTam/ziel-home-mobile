import { useInfiniteScroll } from "@/utils";
import styled from "styled-components";
import PaperPreview from "./PaperPreview";
import React, { useEffect, useState } from "react";
import { getStarPapers, getUserPapers, PaperType } from "@/apis/paper";
import { TFeedType } from "@/pages/feed";
import Empty from "#/lib/Empty";
import FeedDialog from "@/components/feed/FeedDialog";
import { FeedDialogContext, TFeedDialogContext } from "@/components/feed/Feed";

interface PaperListProps {
  userId: string; // 用户Id
  dataSource: TFeedType;
}

const PaperItem = styled.div`
  display: inline-block;
  width: 50%;
  height: auto;
  box-sizing: border-box;
  padding-left: 7px;
`;
const PaperScrollList: React.FC<PaperListProps> = (props) => {
  const [papers, setPapers] = useState<PaperType[]>([]);
  const [currentPaper, setCurrentPaper] = useState<PaperType | null>(null);
  const { loaderRef, page, setLoading, setHasMore, hasMore, firstLoading, setFirstLoading } =
    useInfiniteScroll<HTMLDivElement>({
      hasMore: false,
      initialPage: 1,
    });
  const [open, setOpen] = useState(false);

  const context: TFeedDialogContext = {
    papers,
    setPapers,
    currentPaper,
    setCurrentPaper,
  };

  const handleOpenFeedDialog = (paper: PaperType) => {
    setCurrentPaper(paper);
    setOpen(true);
  };

  const handleCloseFeedDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      if (page === 1) {
        setFirstLoading(true);
      }
      setLoading(true);
      try {
        const response =
          props.dataSource === "user_saved"
            ? await getStarPapers({ userId: props.userId, page })
            : await getUserPapers({ userId: props.userId, page });
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setPapers((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
        setFirstLoading(false);
      }
    })();
  }, [page, props.dataSource, props.userId, setFirstLoading, setHasMore, setLoading]);
  return (
    <>
      {papers.length === 0 && !firstLoading ? (
        <Empty />
      ) : (
        papers.map((paper) => (
          <PaperItem key={paper.id}>
            <PaperPreview
              dataSource={props.dataSource}
              key={paper.id}
              {...paper}
              onOpenFeed={() => handleOpenFeedDialog(paper)}
            />
          </PaperItem>
        ))
      )}
      {hasMore ? <div ref={loaderRef}>loading...</div> : null}
      <FeedDialogContext.Provider value={context}>
        <FeedDialog open={open} onClose={handleCloseFeedDialog} type={props.dataSource} />
      </FeedDialogContext.Provider>
    </>
  );
};
export default PaperScrollList;
