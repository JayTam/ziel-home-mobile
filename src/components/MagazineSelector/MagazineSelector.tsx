import React, { useState } from "react";
import styled from "styled-components";
import UploadIcon from "@/assets/icons/upload_1.svg";
import RightIcon from "@/assets/icons/right.svg";
import Popup from "#/lib/Popup";
import TabPanel from "#/lib/Tabs/TabPanel";
import Tabs from "#/lib/Tabs";
import { getMagazinesForChoose, MagazineType } from "@/apis";
import MagazinePreview from "./MagazinePreview";
import { useUpdateEffect } from "ahooks";
import { useInfiniteScroll } from "@/utils";
import Loading from "#/lib/Loading";
import Empty from "#/lib/Empty";
import Image from "#/lib//Image";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MagazineContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const MagazineCoverWrapper = styled.div`
  width: 60px;
  max-width: 60px;
  min-width: 60px;
  height: 80px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f5f5f5;
  overflow: hidden;
`;

const MagazineCover = styled(Image)`
  width: 100%;
  height: 100%;
`;

const MagazineTitle = styled.p`
  margin-left: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  width: 100%;
`;

const StyledPopup = styled(Popup)`
  height: 90%;
  padding: 0;
`;

const PageContainer = styled.div`
  padding: 14px 0;
`;

const StyledMagazinePreview = styled(MagazinePreview)`
  width: calc((100% - 7px) / 2);
  margin-bottom: 16px;
  box-sizing: border-box;
  display: inline-block;
  &:nth-child(2n-1) {
    margin-right: 7px;
  }
`;

const StyledTabs = styled(Tabs)`
  font-size: 16px;
  line-height: 20px;
  margin: 0 40px 20px 40px;
`;

const StyledTabPanel = styled(TabPanel)`
  max-height: calc(100vh - 112px);
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 14px 100px;
`;

interface MagazineSelectorProps {
  title?: string;
  // 杂志ID
  value?: string;
  onChange?: (magazineId: string) => void;
}

const MagazineSelector = React.forwardRef<HTMLDivElement, MagazineSelectorProps>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"1" | "2" | "3">("3");
  const [magazines, setMagazines] = useState<MagazineType[]>([]);
  const [selectedMagazine, setSelectedMagazine] = useState<MagazineType | null>(null);
  const { loaderRef, page, setPage, setLoading, setHasMore, hasMore, firstLoading } =
    useInfiniteScroll<HTMLDivElement>({
      hasMore: false,
      initialPage: 1,
    });

  useUpdateEffect(() => {
    // skip close magazine selector
    if (!open) return;

    setPage(1);
    setTitle("");
    setType("3");
    setMagazines([]);
  }, [open]);

  useUpdateEffect(() => {
    // skip close magazine selector
    if (!open) return;

    setLoading(true);
    getMagazinesForChoose({ page, title, type, limit: 4 })
      .then((response) => {
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setMagazines((prev) => [...prev, ...list]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, page, setHasMore, setLoading, title, type]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleTabChange = (key: string) => {
    setType(key as "1" | "2" | "3");
    setPage(1);
    setTitle("");
    setMagazines([]);
  };

  const handleChange = (magazine: MagazineType) => {
    setSelectedMagazine(magazine);
    props.onChange?.(magazine.id);
    setOpen(false);
  };

  return (
    <>
      <Container ref={ref} onClick={handleOpen}>
        <MagazineContainer>
          <MagazineCoverWrapper>
            {selectedMagazine ? (
              <MagazineCover src={selectedMagazine.cover} width={60} height={80} alt="cover" />
            ) : (
              <UploadIcon />
            )}
          </MagazineCoverWrapper>
          <MagazineTitle>{selectedMagazine ? selectedMagazine.title : "Zine"}</MagazineTitle>
        </MagazineContainer>
        <RightIcon />
      </Container>
      <StyledPopup open={open} position="bottom" round onClickOverlay={() => setOpen(false)}>
        <PageContainer>
          <StyledTabs activeKey={type} onChange={handleTabChange} tabStyle="dot" space={56}>
            <StyledTabPanel indexKey="3" tab="Discover" forceRender>
              {magazines.map((magazine) => (
                <StyledMagazinePreview
                  key={magazine.id}
                  active={magazine.id === selectedMagazine?.id}
                  {...magazine}
                  onClick={() => handleChange(magazine)}
                />
              ))}
              {magazines.length === 0 && !firstLoading ? <Empty /> : null}
              {hasMore ? <Loading ref={loaderRef} /> : null}
            </StyledTabPanel>
            <StyledTabPanel indexKey="1" tab="My Magazines" forceRender>
              {magazines.map((magazine) => (
                <StyledMagazinePreview
                  key={magazine.id}
                  active={magazine.id === selectedMagazine?.id}
                  {...magazine}
                  onClick={() => handleChange(magazine)}
                />
              ))}
              {magazines.length === 0 ? <Empty /> : null}
              {hasMore ? <Loading ref={loaderRef} /> : null}
            </StyledTabPanel>
          </StyledTabs>
        </PageContainer>
      </StyledPopup>
    </>
  );
});

MagazineSelector.displayName = "MagazineSelector";

export default MagazineSelector;
