import { NextPage } from "next";
import React from "react";
import EditPaper, { EditPaperProps } from "./[paper_id]";

type CreatePaperProps = EditPaperProps;

const PaperCreate: NextPage<CreatePaperProps> = (props) => {
  return <EditPaper {...props} type="create" />;
};

export default PaperCreate;
