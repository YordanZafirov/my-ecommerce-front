import styled from "styled-components"
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Textarea from "./Textarea";

const Title = styled.h2`
font-size:1.2rem;
margin-bottom: 5px;
`;

const SubTitle = styled.h3`
font-size: 1rem;
margin-top: 5px;
`;

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;

const ReviewWrapper = styled.div`
margin-bottom: 10px;
border-top: 1px solid #ddd ;
padding: 10px 0;
h3{
    margin: 0;
    font-size: 1rem;
}
p{
    margin: 5px 0;
    font-size: .9rem;
    line-height: 1rem;
    color: #333;
}
`

const ReviewHeader = styled.div`
display: flex;
justify-content: space-between;
time{
    font-size: 14px;
    font-weight: bold;
    color: #555;
}
`;

export default function ProductReviews({ product }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stars, setStars] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    function submitReview() {
        const data = { title, description, stars, product: product._id }
        axios.post('/api/reviews', data).then(res => {
            setTitle('');
            setDescription('');
            setStars(0);
            loadReviews();
        })
    }

    useEffect(() => {
        loadReviews();
    }, []);

    function loadReviews(){
        setIsLoading(true);
        axios.get('/api/reviews?product=' + product._id).then(res => {
            setReviews(res.data);
            setIsLoading(false);
        });
    }

    return (
        <div>
            <Title>Отзиви</Title>
            <ColsWrapper>
            <div>
            <WhiteBox>
                    <SubTitle>Добавете отзив</SubTitle>
                    <div>
                        <StarsRating onChange={setStars} />
                    </div>
                    <Input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Заглавие" />
                    <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Вашето мнение" />
                    <div>
                        <Button primary onClick={submitReview}>Изпратете отзива си</Button>
                    </div>
                </WhiteBox>
            </div>
            <div>          
            <WhiteBox>
                    <SubTitle>Всички отзиви</SubTitle>
                    {isLoading && (
                        <Spinner fullWidth={true} />
                    )}
                    {reviews.length === 0 && (
                        <p>Няма отзиви за този продукт</p>
                    )}
                    {reviews.length > 0 && reviews.map(review => (
                        <ReviewWrapper>
                            <ReviewHeader>
                                    <StarsRating size={'sm'} disabled={true} defaultHowMany={review.stars} />
                                    <time>{(new Date(review.createdAt)).toLocaleString('en-GB')}</time>
                            </ReviewHeader>
                            <h3>{review.title}</h3>
                            <p>{review.description}</p>          
                        </ReviewWrapper>
                    ))}
                </WhiteBox>
            </div>
            </ColsWrapper>
        </div>
    )
}