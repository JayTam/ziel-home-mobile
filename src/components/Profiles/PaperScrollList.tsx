import { useInfiniteScroll } from "../../utils";
import styled from "styled-components";
import PaperPrevew from "./PaperPreview";
import { useEffect, useState } from "react";
import { getStarPapers, getUserPapers, PaperType } from "../../apis/paper";

interface PaperListProps {
  userId: string; // 用户Id
  isStar?: boolean; // 是否为收藏内容
  isShowTop?: boolean;
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
  const { loaderRef, page, setLoading, setHasMore, hasMore } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
    initialPage: 0,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = props.isStar
          ? await getStarPapers({ userId: props.userId, page })
          : await getUserPapers({ userId: props.userId, page });
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setPapers((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, props.isStar, props.userId, setHasMore, setLoading]);
  return (
    <>
      {papers.map((paper) => (
        <PaperItem key={paper.id}>
          <PaperPrevew isShowTop={props.isShowTop} key={paper.id} {...paper} />
        </PaperItem>
      ))}
      {hasMore ? <div ref={loaderRef}>loading...</div> : null}
    </>
  );
};
export default PaperScrollList;
