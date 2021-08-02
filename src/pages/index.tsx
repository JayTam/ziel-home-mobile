import styled from "styled-components";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 4px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};
  margin: 0 1em;
  padding: 0.25em 1em;
`;

export default function Home() {
  return (
    <div>
      <Button>hello</Button>
    </div>
  );
}
