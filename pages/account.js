import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SingleOrder from "@/components/SingleOrder";

const ColsWrapper = styled.div`
display: grid;
grid-template-columns: 1.2fr .8fr;
gap: 40px;
margin:40px 0;
p{
    margin: 5px;
}
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 40px;
`;

export default function AccountPage() {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [addressLoaded, setAddressLoaded] = useState(true);
    const [wishlistLoaded, setWishlistLoaded] = useState(true);
    const [ordersLoaded, setOrdersLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Поръчки');
    const [orders, setOrders] = useState([]);

    async function logout() {
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
    }

    async function login() {
        await signIn('google');
    }

    async function saveAddress() {
        const data = { name, email, city, postalCode, streetAddress, country };
        await axios.put('/api/address', data)
    }

    useEffect(() => {
        if (!session) {
            return;
        }
        setAddressLoaded(false);
        setWishlistLoaded(false);
        setOrdersLoaded(false);
        axios.get('/api/address').then(res => {
            setName(res.data.name);
            setEmail(res.data.email);
            setCity(res.data.city);
            setPostalCode(res.data.postalCode);
            setStreetAddress(res.data.streetAddress);
            setCountry(res.data.country);
            setAddressLoaded(true);
        });
        axios.get('/api/wishlist').then(res => {
            setWishedProducts(res.data.map(wp => wp.product));
            setWishlistLoaded(true);
        });
        axios.get('/api/orders').then(res=>{
            setOrders(res.data);
            setOrdersLoaded(true);
        })
    }, [session]);

    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(products => {
            return [...products.filter(p => p._id.toString() !== idToRemove)]
        })
    }

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <Tabs
                                    tabs={['Поръчки', 'Желани']}
                                    active={activeTab}
                                    onChange={setActiveTab}
                                />
                                {activeTab === 'Поръчки' && (
                                    <>
                                    {!ordersLoaded && (
                                        <Spinner fullWidth={true} />
                                    )}

                                    {ordersLoaded && (
                                        <div>
                                            {orders.length === 0 && (
                                                <p>Влезте във вашия профил, за да видите вашите поръчки</p>
                                            )}
                                            {orders.length > 0 && orders.map(o => (
                                                <SingleOrder key={o._id} {...o}/>
                                            ))}
                                        </div>
                                    )}
                                    </>
                                )}
                                {activeTab === 'Желани' && (
                                    <>
                                        {!wishlistLoaded && (
                                            <Spinner fullWidth={true} />
                                        )}
                                        {wishlistLoaded && (
                                            <>
                                                <WishedProductsGrid>
                                                    {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                        <ProductBox key={wp._id} {...wp} wished={true}
                                                            onRemoveFromWishlist={productRemovedFromWishlist} />
                                                    ))}
                                                </WishedProductsGrid>
                                                {wishedProducts.length === 0 && (
                                                    <>
                                                        {session && (
                                                            <p>Списъкът ви с желани продукти е празен</p>
                                                        )}
                                                        {!session && (
                                                            <p>Влезте във вашия профил, за да запазите желани продукти</p>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <h2>{session ? 'Детайли за акаунта' : 'Вход'}</h2>

                                {!addressLoaded && (
                                    <Spinner fullWidth={true} />
                                )}

                                {addressLoaded && session && (
                                    <>
                                        <Input type="text"
                                            placeholder="Име"
                                            value={name}
                                            name="name"
                                            onChange={ev => setName(ev.target.value)} />
                                        <Input type="text"
                                            placeholder="Имейл"
                                            value={email}
                                            name="email"
                                            onChange={ev => setEmail(ev.target.value)} />
                                        <CityHolder>
                                            <Input type="text"
                                                placeholder="Град"
                                                value={city}
                                                name="city"
                                                onChange={ev => setCity(ev.target.value)} />
                                            <Input type="text"
                                                placeholder="Пощенски код"
                                                value={postalCode}
                                                name="postalCode"
                                                onChange={ev => setPostalCode(ev.target.value)} />
                                        </CityHolder>
                                        <Input type="text"
                                            placeholder="Адрес на улицата"
                                            value={streetAddress}
                                            name="streetAddress"
                                            onChange={ev => setStreetAddress(ev.target.value)} />
                                        <Input type="text"
                                            placeholder="Държава"
                                            value={country}
                                            name="country"
                                            onChange={ev => setCountry(ev.target.value)} />
                                        <Button black block
                                            onClick={saveAddress}>
                                            Запази
                                        </Button>
                                    </>
                                )}

                                <hr />
                                {session && (
                                    <Button block primary onClick={logout}>Изход</Button>
                                )}
                                {!session && (
                                    <Button block primary onClick={login}>Влезте с Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    )
}