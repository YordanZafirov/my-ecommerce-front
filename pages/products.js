import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrig from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default function ProductsPage({products, wishedProducts}) {
    return (
        <>
            <Header />
            <Center>
                <Title>Всички продукти</Title>
                <ProductsGrig products={products} wishedProducts={wishedProducts}/>
            </Center>
        </>
    )
}

export async function getServerSideProps(context){
    await mongooseConnect();
    const products = await Product.find({}, null, {sort: {'_id': -1}})
    const session = await getServerSession(context.req, context.res, authOptions);
    const wishedProducts = session?.user
    ? await WishedProduct.find({
      userEmail: session?.user.email,
      product: products.map(p => p._id.toString()),
    })
    : []
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        }
    }
}