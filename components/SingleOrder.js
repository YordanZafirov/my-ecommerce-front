import styled from "styled-components"

const StyledOrder = styled.div`
margin: 10px 0;
padding: 10px 0;
border-bottom: 1px solid #ddd;
display: flex;
gap: 40px;
align-items: center;
time{
    font-size: 1rem;
    font-weight: bold;
}
`;

const ProductRow = styled.div`
span{
    color: green;
}
`;

const Address = styled.div`
margin-top: 5px;
`

export default function SingleOrder({ line_items, createdAt, ...rest }) {
    return (
        <StyledOrder>
            <div>
                <time>{(new Date(createdAt)).toLocaleString('en-GB')}</time>
                <Address>
                    {rest.name} <br />
                    {rest.streetAddress} <br />
                    {rest.postalCode} <br />
                    {rest.city}, {rest.country}
                </Address>
            </div>
            <div>
                {line_items.map(item => (
                    <ProductRow key={item}>
                        <span>{item.quantity}</span> x {item.price_data.product_data.name}
                    </ProductRow>
                ))}
            </div>
        </StyledOrder>
    )
}