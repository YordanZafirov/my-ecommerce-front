import styled from "styled-components";
import { ButtonStyle } from "./Button";
import { primary } from "@/lib/colors";
import { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div`
button{
    width: 100%;
    text-align: center;
    justify-content: center;
}
`;

const FlyingButtonWrapper = styled.div`
button{
${ButtonStyle}
${props => props.main ? `
background-color: ${primary};
color: white;
font-size: 1.2rem;
` : `
background-color: transparent;
border: 1px solid ${primary};
color: ${primary};
font-size: 1.2rem;
`}
${props => props.white && `
background-color:white;
border: 1px solid white;
font-size: 1rem;
`}
}
@keyframes fly {
    100%{
        top:0;
        left:60%;
        opacity: 0;
        display:none;
    }
}
img{
    max-width: 50px;
    max-height: 50px;
    opacity: 1;
    position: fixed;
    display: none;
    z-index: 5;
    animation: fly 1s;
    border-radius: 10px;
}
`;

export default function FlyingButton(props) {
    const { addProduct } = useContext(CartContext);
    const imgRef = useRef();

    function sendImageToCart(e) {
        imgRef.current.style.display = 'inline-block';
        imgRef.current.style.left = (e.clientX - 50) + 'px';
        imgRef.current.style.top = (e.clientY - 50) + 'px';
        setTimeout(() => {
            imgRef.current.style.display = 'none'

        }, 1000)
    }
    useEffect(() => {
        const interval = setInterval(() => {
            const reveal = imgRef?.current?.closest('div[data-sr-id]');
            if (reveal?.style.opacity === '1') {
                //visible
                reveal.style.transform = 'none';
            }
        }, 100)
        return () => clearInterval(interval)
    }, [])
    return (
        <>
            <ProductWrapper>
                <FlyingButtonWrapper
                    white={props.white} main={props.main}
                    onClick={() => addProduct(props._id)}>
                    <img src={props.src} alt="" ref={imgRef} />
                    <button
                        onClick={e => sendImageToCart(e)}
                        {...props} />
                </FlyingButtonWrapper>
            </ProductWrapper>
        </>
    )
}