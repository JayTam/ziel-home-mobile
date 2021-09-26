import React from "react";
import Popup, { PopupProps } from "#/lib/Popup";
import styled from "styled-components";
import { MagazineType } from "@/apis";
import { TFeedType } from "@/pages/feed";
import Feed from "@/components/feed/Feed";

export interface FeedDialogProps {
  open: boolean;
  magazineId?: string;
  userId?: string;
  paperId?: string;
  type?: TFeedType;
  position?: PopupProps["position"];
  onClose?: (magazine: MagazineType) => void;
}

const StyledPopup = styled(Popup)`
  padding: 0;
`;

const FeedDialog: React.FC<FeedDialogProps> = (props) => {
  return (
    <StyledPopup open={props.open} position={props.position} forceRender>
      <Feed
        magazineId={props.magazineId}
        paperId={props.paperId}
        userId={props.userId}
        type={props.type}
        onClickBack={props.onClose}
        position={props.position}
      />
    </StyledPopup>
  );
};

FeedDialog.defaultProps = {
  position: "bottom",
};

export default FeedDialog;
