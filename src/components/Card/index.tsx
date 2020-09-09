import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledCard = styled(Link)`
  display: flex;
  background-color: var(--color-white);
  font-size: 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35rem;
`;

const StyledImg = styled.img`
  max-width: 100%;
`;

interface cardProps {
  image: string;
  name: string;
  price: string;
  id: string;
}

const Card: React.FC<cardProps> = (props) => {
  return (
    <StyledCard to={`/product/${props.id}`}>
      <StyledImg src={props.image} alt="" />
      <div>{props.name}</div>
      <div>{props.price}</div>
    </StyledCard>
  );
};

export default Card;
