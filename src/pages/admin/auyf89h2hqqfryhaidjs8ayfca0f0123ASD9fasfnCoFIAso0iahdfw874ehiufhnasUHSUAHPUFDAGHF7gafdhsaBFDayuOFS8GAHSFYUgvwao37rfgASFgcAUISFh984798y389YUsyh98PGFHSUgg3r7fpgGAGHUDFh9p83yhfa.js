import { Client } from "api/contentful";
import Product from "models/Models";
import { useEffect } from "react";
import db from "utils/db";

const auyf89h2hqqfryhaidjs8ayfca0f0123ASD9fasfnCoFIAso0iahdfw874ehiufhnasUHSUAHPUFDAGHF7gafdhsaBFDayuOFS8GAHSFYUgvwao37rfgASFgcAUISFh984798y389YUsyh98PGFHSUgg3r7fpgGAGHUDFh9p83yhfa = () => {
    useEffect(() => {
        window.location.href = "/admin/products";
    }, []);

    return (
        <div>Loading Data...</div>
    );
}

export default auyf89h2hqqfryhaidjs8ayfca0f0123ASD9fasfnCoFIAso0iahdfw874ehiufhnasUHSUAHPUFDAGHF7gafdhsaBFDayuOFS8GAHSFYUgvwao37rfgASFgcAUISFh984798y389YUsyh98PGFHSUgg3r7fpgGAGHUDFh9p83yhfa;

auyf89h2hqqfryhaidjs8ayfca0f0123ASD9fasfnCoFIAso0iahdfw874ehiufhnasUHSUAHPUFDAGHF7gafdhsaBFDayuOFS8GAHSFYUgvwao37rfgASFgcAUISFh984798y389YUsyh98PGFHSUgg3r7fpgGAGHUDFh9p83yhfa.auth = {adminOnly: true}

export async function getServerSideProps () {
    
    const response = await Client.getEntries({
        content_type: "products",
        limit: 1, //Remove this when testing is done
      });
    await db.connect();

    const items = response.items

    const products = [];

    //Convert to format used in here
    items.map((item) => {
        let slugTemp = item.fields.name.replace(" ", "-").toLowerCase();

        let tempProd = new Product({
            name: item.fields.name,
            slug: slugTemp,
            category: item.fields.category[0].fields.categoryName,
            image: "/images/default.jpg", //Default value
            price: 0, //Default value
            brand: item.fields.brand,
            rating: 0, //Default value
            numReviews: 0, //Default value
            countInStock: 0, //Default value
            description: "N/A", //Default value
            visible: false, //Default value
        });

        products.push(tempProd);
    });

    console.log(products);

    //Upsert to MongoDB
    products.map(async (product) => {
        await product.save();
    });
    
    return {
        props: {
            ret: 0
        },
    };
};