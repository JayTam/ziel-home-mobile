import React, { useState } from "react";
import styled from "styled-components";

import UploadIcon from "../../assets/icons/upload_1.svg";
import RightIcon from "../../assets/icons/right.svg";
import Popup from "../../../lib/Popup";
import Header from "../Header";
import TabPanel from "../../../lib/Tabs/TabPanel";
import Tabs from "../../../lib/Tabs";
import { getMagazinesForChoose, MagazineType } from "../../apis";
import MagazinePreview from "./MagazinePreview";
import { useUpdateEffect } from "ahooks";
import { useInfiniteScroll } from "../../utils";
import Loading from "../../../lib/Loading";

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

const MagazineCover = styled.img`
  width: 100%;
  height: 100%;
`;

const MagazineTitle = styled.p`
  font-family: "DidotBold", serif;
  margin-left: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  width: 100%;
`;

const StyledPopup = styled(Popup)`
  height: 100%;
  padding: 0;
`;

const DoneButton = styled.div`
  color: #0474fa;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
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
  margin-left: 14px;
  margin-right: 14px;
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
  const { loaderRef, page, setPage, setLoading, setHasMore, hasMore } =
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleDone = () => {
    if (selectedMagazine) props.onChange?.(selectedMagazine.id);
    setOpen(false);
  };

  const handleChange = (key: string) => {
    setType(key as "1" | "2" | "3");
    setPage(1);
    setTitle("");
    setMagazines([]);
  };

  return (
    <>
      <Container ref={ref} onClick={handleOpen}>
        <MagazineContainer>
          <MagazineCoverWrapper>
            {selectedMagazine ? (
              <MagazineCover src={selectedMagazine.cover} alt="cover" />
            ) : (
              <UploadIcon />
            )}
          </MagazineCoverWrapper>
          <MagazineTitle>
            {selectedMagazine ? selectedMagazine.title : "Publish In a Magazine"}{" "}
          </MagazineTitle>
        </MagazineContainer>
        <RightIcon />
      </Container>
      <StyledPopup open={open} position="bottom">
        <Header
          rightComponent={<DoneButton onClick={handleDone}>Done</DoneButton>}
          onBack={handleClose}
        >
          Publish In a Magazine
        </Header>

        <PageContainer>
          <StyledTabs activeKey={type} onChange={handleChange} tabBar tabStyle="line">
            <StyledTabPanel indexKey="3" tab="Discover" forceRender>
              {magazines.map((magazine) => (
                <StyledMagazinePreview
                  key={magazine.id}
                  active={magazine.id === selectedMagazine?.id}
                  {...magazine}
                  onClick={() => setSelectedMagazine(magazine)}
                />
              ))}
              {hasMore ? <Loading ref={loaderRef} /> : null}
            </StyledTabPanel>
            <StyledTabPanel indexKey="1" tab="My Magazines" forceRender>
              {magazines.map((magazine) => (
                <StyledMagazinePreview
                  key={magazine.id}
                  active={magazine.id === selectedMagazine?.id}
                  {...magazine}
                  onClick={() => setSelectedMagazine(magazine)}
                />
              ))}
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
