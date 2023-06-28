import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CategoryTitle = styled.div`
display: flex;
margin-top: 40px;
margin-bottom: 0;
align-items: center;
gap: 10px;
h2{
    margin-bottom: 10px;
}
a{
    color: #555;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    text-decoration: none;
}
`;

const CategoryWrapper = styled.div`
margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
background-color: #ddd;
color: #333;
height: 180px;
border-radius: 10px;
align-items: center;
display: flex;
justify-content: center;
text-decoration: none;
`

export default function CategoriesPage({ mainCategories, categoriesProducts, wishedProducts=[] }) {
    return (
        <>
            <Header />
            <Center>
                {mainCategories.map(cat => (
                    <CategoryWrapper key={cat._id}>
                        <CategoryTitle>
                            <h2>{cat.name}</h2>
                            <div>
                                <Link href={'/category/' + cat._id}>Покажи всички</Link>
                            </div>
                        </CategoryTitle>
                        <CategoryGrid>
                            {categoriesProducts[cat._id].map((p, index) => (
                                <RevealWrapper key={index} delay={index * 50}>
                                    <ProductBox {...p} wished={wishedProducts.includes(p._id)}/>
                                </RevealWrapper>
                            ))}
                            <RevealWrapper delay={categoriesProducts[cat._id].length * 50}>
                                <ShowAllSquare href={'/category/' + cat._id}>
                                    Покажи всички &rarr;
                                </ShowAllSquare>
                            </RevealWrapper>
                        </CategoryGrid>
                    </CategoryWrapper>
                ))}
            </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect();

    const categories = await Category.find();
    const mainCategories = categories.filter(c => !c.parent);
    const categoriesProducts = {};
    const allFetchedProductsId = [];
    for (const mainCat of mainCategories) {
        const mainCatId = mainCat._id.toString();
        const childCatIds = categories
            .filter(c => c?.parent?.toString() === mainCatId)
            .map(c => c._id.toString());
        const categoriesIds = [mainCatId, ...childCatIds]
        const products = await Product.find({ category: categoriesIds }, null, { limit: 3, sort: { '_id': -1 } });
        allFetchedProductsId.push(...products.map(p=>p._id.toString()));
        categoriesProducts[mainCat._id] = products;
    }

    const session = await getServerSession(context.req, context.res, authOptions);
    const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: allFetchedProductsId,
    })
    : []

    return {
        props: {
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map(i=> i.product.toString())
        },
    }
}