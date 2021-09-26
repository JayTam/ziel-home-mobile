import React from "react";
import Popup from "#/lib/Popup";
import styled from "styled-components";
import { MagazineType } from "@/apis";
import { TFeedType } from "@/pages/feed";
import Feed from "@/components/feed/Feed";

interface FeedDialogProps {
  open: boolean;
  magazineId?: string;
  userId?: string;
  paperId?: string;
  type?: TFeedType;
  onClose?: (magazine: MagazineType) => void;
}

const StyledPopup = styled(Popup)`
  padding: 0;
`;

const FeedDialog: React.FC<FeedDialogProps> = (props) => {
  return (
    <StyledPopup open={props.open} position="bottom" forceRender>
      <Feed
        magazineId={props.magazineId}
        paperId={props.paperId}
        userId={props.userId}
        type={props.type}
        onClickBack={props.onClose}
      />
    </StyledPopup>
  );
};

export default FeedDialog;
