import styled from "styled-components";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import FlyingButton from '@/components/FlyingButton'
import HeartOutLineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HearthSolidIcon";
import axios from "axios";

const WhiteBox = styled(Link)`
background-color: #fff;
padding: 20px;
height: 140px;
text-align: center;
display: flex;
align-items: center;
justify-content: center;
border-radius: 10px;
position: relative;
img{
    max-width: 100%;
    max-height: 80px;
}
`;

const Title = styled(Link)`
font-weight: normal;
font-size: 1rem;
color: inherit;
text-decoration: none;
margin: 0;
`;

const ProductInfoBox = styled.div`
margin-top: 5px;
`

const PriceRow = styled.div`
display: block;
@media screen and (min-width: 768px){
    display: flex;
    gap: 5px;
}
align-items: center;
justify-content: space-between;
margin-top: 2px;
`;

const Price = styled.div`
font-size: 1rem;
font-weight: 400;
text-align: right;
@media screen and (min-width: 768px){
font-size: 1.2rem;
text-align: left;
}
`;

const WishListButton = styled.button`
border: 0;
width: 40px !important;
height: 40px;
padding: 10px;
position: absolute;
top: 0;
right: 0;
background: transparent;
cursor: pointer;
${props => props.wished ? `
color:red;
` : `
color:black
`}
svg{
    width: 16px;
}
`;

export default function ProductBox({
    _id,
    title,
    description,
    price,
    images,
    wished = false,
    onRemoveFromWishlist=()=>{}
}) {
    const url = '/product/' + _id;
    const [isWished, setIsWished] = useState(wished);

    function addToWishlist(e) {
        e.preventDefault();
        e.stopPropagation();
        const nextValue = !isWished;

        if(nextValue === false && onRemoveFromWishlist){
            onRemoveFromWishlist(_id);
        }

        axios.post('/api/wishlist', {
            product: _id
        }).then(() => {});
        setIsWished(nextValue);
    }

    return (
        <div>
            <WhiteBox href={url}>
                <div>
                    <WishListButton wished={isWished} onClick={addToWishlist}>
                        {isWished ? <HeartSolidIcon /> : <HeartOutLineIcon />}
                    </WishListButton>
                    <img src={images?.[0]} alt="" />
                </div>

            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>
                        {price.toFixed(2)} лв.
                    </Price>
                    <FlyingButton _id={_id} src={images?.[0]}>Купи</FlyingButton>
                </PriceRow>
            </ProductInfoBox>
        </div>
    )
}